import React from "react";
import { Card, Flex, Form } from "antd";
import { Title } from "@/components/antd-sub-components";
import Image from "next/image";

const GetStartedService = ({ next }: { next: () => void }) => {
  const form = Form.useFormInstance();
  const onClick = (service: string) => () => {
    form.setFieldValue("service", service);
    next();
  };
  return (
    <Flex wrap="wrap" gap={4} justify="space-between" className="mt-4">
      <Card
        className="w-40 hover:border-primary cursor-pointer group flex justify-center"
        onClick={onClick("full-detail")}
      >
        <Image
          src="/images/service/full-detail.png"
          alt="coupe"
          width={120}
          height={120}
          className="group-hover:scale-105 transition ease-in-out rounded-full"
        />
        <Title
          level={5}
          className="text-center !mt-3 group-hover:!text-primary"
        >
          Full Detail
        </Title>
      </Card>
      <Card
        className="w-40 hover:border-primary cursor-pointer group flex justify-center"
        onClick={onClick("interior")}
      >
        <Image
          src="/images/service/interior.png"
          alt="sedan"
          width={120}
          height={120}
          className="group-hover:scale-105 transition ease-in-out rounded-full"
        />
        <Title
          level={5}
          className="text-center !mt-3 group-hover:!text-primary"
        >
          Interior Only
        </Title>
      </Card>
      <Card
        className="w-40 hover:border-primary cursor-pointer group flex justify-center"
        onClick={onClick("exterior")}
      >
        <Image
          src="/images/service/exterior.png"
          alt="suv"
          width={120}
          height={120}
          className="group-hover:scale-105 transition ease-in-out rounded-full"
        />
        <Title
          level={5}
          className="text-center !mt-3 group-hover:!text-primary"
        >
          Exterior Only
        </Title>
      </Card>
    </Flex>
  );
};

export default GetStartedService;
