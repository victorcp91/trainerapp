"use client";

import { Stack, Tabs, Container, Title } from "@mantine/core";
import {} from "@tabler/icons-react";
import { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import ClientProfileHeader from "@/components/clients/profile/ClientProfileHeader";
import ProfileTabContent from "@/components/clients/profile/ProfileTabContent";
import TrainingTabContent from "@/components/clients/profile/TrainingTabContent";
import EvolutionTabContent from "@/components/clients/profile/EvolutionTabContent";
import AnamnesisTabContent from "@/components/clients/profile/AnamnesisTabContent";
import ProgressComparisonModal from "@/components/clients/profile/ProgressComparisonModal";
import ReplicateTrainingModal from "@/components/clients/profile/ReplicateTrainingModal";
import { useTranslations } from "next-intl";

function ClientProfilePage() {
  const t = useTranslations();
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState<string>("");
  const [newNoteDate, setNewNoteDate] = useState<Date | null>(new Date());
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);
  const [comparisonModalOpened, setComparisonModalOpened] = useState(false);
  const [beforeDate, setBeforeDate] = useState<string | null>(null);
  const [replicateModalOpened, setReplicateModalOpened] = useState(false);
  const [isClientActive, setIsClientActive] = useState<boolean>(true);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentTab = searchParams?.get("tab") || "profile";

  const handleTabChange = (value: string | null) => {
    if (value) {
      router.push(`${pathname}?tab=${value}`);
    }
  };

  const progressPhotos: Record<
    string,
    { front: string; side: string; back: string }
  > = {
    "03/19": {
      front: "/path/to/photo1-front.jpg",
      side: "/path/to/photo1-side.jpg",
      back: "/path/to/photo1-back.jpg",
    },
    "11/19": {
      front: "/path/to/photo2-front.jpg",
      side: "/path/to/photo2-side.jpg",
      back: "/path/to/photo2-back.jpg",
    },
  };

  const photoDates = Object.keys(progressPhotos);

  const handlePhotoClick = (date: string) => {
    setBeforeDate(date);
    setComparisonModalOpened(true);
  };

  const handleReplicateSeries = (startDate: Date, endDate: Date) => {
    alert(
      `Série replicada como rascunho de ${startDate.toLocaleDateString(
        "pt-BR"
      )} até ${endDate.toLocaleDateString("pt-BR")}`
    );
    setReplicateModalOpened(false);
  };

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="md">
        Perfil do Cliente
      </Title>
      <Stack>
        <ClientProfileHeader
          clientName="Ben Andrew"
          clientType="Híbrido"
          clientTypeColor="blue"
          isActive={isClientActive}
          onActiveChange={setIsClientActive}
        />

        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tabs.List>
            <Tabs.Tab value="profile">
              {t("clientProfile.tabs.profile")}
            </Tabs.Tab>
            <Tabs.Tab value="training">
              {t("clientProfile.tabs.training")}
            </Tabs.Tab>
            <Tabs.Tab value="evolution">
              {t("clientProfile.tabs.evolution")}
            </Tabs.Tab>
            <Tabs.Tab value="anamnesis">
              {t("clientProfile.tabs.anamnesis")}
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="profile" pt="md">
            <ProfileTabContent
              notes={notes}
              newNote={newNote}
              newNoteDate={newNoteDate}
              isAddingNote={isAddingNote}
              setNotes={setNotes}
              setNewNote={setNewNote}
              setNewNoteDate={setNewNoteDate}
              setIsAddingNote={setIsAddingNote}
              router={router}
            />
          </Tabs.Panel>

          <Tabs.Panel value="training" pt="md">
            <TrainingTabContent
              router={router}
              setReplicateModalOpened={setReplicateModalOpened}
            />
          </Tabs.Panel>

          <Tabs.Panel value="anamnesis" pt="md">
            <AnamnesisTabContent
              photoDates={photoDates}
              progressPhotos={progressPhotos}
              onPhotoClick={handlePhotoClick}
            />
          </Tabs.Panel>

          <Tabs.Panel value="evolution" pt="md">
            <EvolutionTabContent
              photoDates={photoDates}
              progressPhotos={progressPhotos}
              onPhotoClick={handlePhotoClick}
            />
          </Tabs.Panel>
        </Tabs>

        <ProgressComparisonModal
          isOpen={comparisonModalOpened}
          onClose={() => setComparisonModalOpened(false)}
          photoDates={photoDates}
          progressPhotos={progressPhotos}
          initialBeforeDate={beforeDate}
        />

        <ReplicateTrainingModal
          isOpen={replicateModalOpened}
          onClose={() => setReplicateModalOpened(false)}
          onConfirm={handleReplicateSeries}
        />
      </Stack>
    </Container>
  );
}

export default ClientProfilePage;
