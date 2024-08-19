import React from "react";
import { Card, Flex, Form } from "antd";
import { Title } from "@/components/antd-sub-components";
import Image from "next/image";

const GetStartedSize = ({ next }: { next: () => void }) => {
  const form = Form.useFormInstance();
  const onClick = (size: string) => () => {
    form.setFieldValue("size", size);
    next();
  };
  return (
    <Flex wrap="wrap" gap={4} justify="space-between" className="mt-4">
      <Card
        className="w-40 hover:border-primary cursor-pointer group flex justify-center"
        onClick={onClick("coupe")}
      >
        <Image
          src="/images/vehicle/coupe.jpg"
          alt="coupe"
          width={120}
          height={120}
          className="group-hover:scale-105 transition ease-in-out rounded-full"
        />
        <Title
          level={5}
          className="text-center !mt-3 group-hover:!text-primary"
        >
          Coupe
        </Title>
      </Card>
      <Card
        className="w-40 hover:border-primary cursor-pointer group flex justify-center"
        onClick={onClick("sedan")}
      >
        <Image
          src="/images/vehicle/sedan.jpg"
          alt="sedan"
          width={120}
          height={120}
          className="group-hover:scale-105 transition ease-in-out rounded-full"
        />
        <Title
          level={5}
          className="text-center !mt-3 group-hover:!text-primary"
        >
          Sedan
        </Title>
      </Card>
      <Card
        className="w-40 hover:border-primary cursor-pointer group flex justify-center"
        onClick={onClick("suv")}
      >
        <Image
          src="/images/vehicle/suv.jpg"
          alt="suv"
          width={120}
          height={120}
          className="group-hover:scale-105 transition ease-in-out rounded-full"
        />
        <Title
          level={5}
          className="text-center !mt-3 group-hover:!text-primary"
        >
          SUV
        </Title>
      </Card>
    </Flex>
  );
};

export default GetStartedSize;
