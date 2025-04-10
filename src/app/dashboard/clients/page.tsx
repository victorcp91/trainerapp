"use client";

import React, { useState } from "react";
import { withAuth } from "@/utils/withAuth";
import { Button, Flex, Title } from "@mantine/core";
import { SelectClearable } from "@/components/shared";

const ClientsPage = () => {
  const [showClientType, setShowClientType] = useState<string | null>("");
  const clientTypes = ["online", "presencial", "híbrido"];

  return (
    <>
      <Flex>
        <Title order={3}>Todos os clientes(0)</Title>
      </Flex>
      <Flex py="md" justify="space-between">
        <Flex>
          <SelectClearable
            options={clientTypes}
            value={showClientType}
            setValue={setShowClientType}
          />
        </Flex>
        <Button>Adicionar cliente</Button>
      </Flex>
    </>
  );
};

export default withAuth(ClientsPage, false);
