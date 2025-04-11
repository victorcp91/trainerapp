"use client";

import React, { useState } from "react";
import { withAuth } from "@/utils/withAuth";
import {
  Button,
  Flex,
  Title,
  TextInput,
  Card,
  Grid,
  Badge,
} from "@mantine/core";
import { SelectClearable } from "@/components/shared";
import Link from "next/link";
import {
  IconCheck,
  IconAlertTriangle,
  IconAlertCircle,
} from "@tabler/icons-react";

const ClientsPage = () => {
  const [showClientType, setShowClientType] = useState<string | null>("");
  const [showSeriesStatus, setShowSeriesStatus] = useState<string | null>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const clientTypes = ["online", "presencial", "híbrido"];
  const seriesStatuses = ["em dia", "próximo ao vencimento", "vencida"];

  const clients = [
    {
      name: "Alice Johnson",
      age: 28,
      gender: "Female",
      email: "alice@example.com",
      phone: "555-123-4567",
      tags: ["Weight Loss", "Muscle Tone"],
      status: "em dia",
      type: "online",
    },
    {
      name: "Bob Smith",
      age: 35,
      gender: "Male",
      email: "bob@example.com",
      phone: "555-987-6543",
      tags: ["Muscle Building", "Strength"],
      status: "próximo ao vencimento",
      type: "presencial",
    },
    {
      name: "Carol Wilson",
      age: 42,
      gender: "Female",
      email: "carol@example.com",
      phone: "555-456-7890",
      tags: ["Flexibility", "Core Strength"],
      status: "vencida",
      type: "híbrido",
    },
  ];

  return (
    <>
      <Flex justify="space-between" align="center" mb="lg">
        <Title order={2}>My Clients</Title>
        <Button>+ Add Client</Button>
      </Flex>
      <Flex mb="lg" gap="md">
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Buscar Clientes
          </label>
          <TextInput
            placeholder="Search clients by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Tipo de Cliente
          </label>
          <SelectClearable
            options={clientTypes}
            value={showClientType}
            setValue={setShowClientType}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Status da Série
          </label>
          <SelectClearable
            options={seriesStatuses}
            value={showSeriesStatus}
            setValue={setShowSeriesStatus}
          />
        </div>
      </Flex>
      <Grid>
        {clients.map((client, index) => (
          <Grid.Col key={index} span={4}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Link href="/dashboard/clients/clientId">
                <Title order={4}>{client.name}</Title>
                <p>
                  {client.age} years • {client.gender}
                </p>
              </Link>
              <Flex gap="xs" wrap="wrap" mb="sm">
                {client.tags.map((tag, idx) => (
                  <Badge key={idx} color="blue" variant="light">
                    {tag}
                  </Badge>
                ))}
              </Flex>
              <Badge color="gray" variant="outline" mb="sm">
                {client.type}
              </Badge>
              <Flex align="center" gap="xs" mb="sm">
                {client.status === "em dia" && (
                  <>
                    <IconCheck size={16} color="green" />
                    <p style={{ color: "green" }}>
                      Série: <strong>{client.status}</strong>
                    </p>
                  </>
                )}
                {client.status === "próximo ao vencimento" && (
                  <>
                    <IconAlertTriangle size={16} color="orange" />
                    <p style={{ color: "orange" }}>
                      Série: <strong>{client.status}</strong>
                    </p>
                  </>
                )}
                {client.status === "vencida" && (
                  <>
                    <IconAlertCircle size={16} color="red" />
                    <p style={{ color: "red" }}>
                      Série: <strong>{client.status}</strong>
                    </p>
                  </>
                )}
              </Flex>
              <p>Email: {client.email}</p>
              <p>Phone: {client.phone}</p>
              <Flex mt="md" gap="sm">
                <Button variant="outline" size="xs">
                  Schedule
                </Button>
                <Button variant="outline" size="xs">
                  Workout Plan
                </Button>
              </Flex>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </>
  );
};

export default withAuth(ClientsPage, false);
