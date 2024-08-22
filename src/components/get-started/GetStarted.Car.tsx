import React from "react";
import { Card, Col, Form, Row } from "antd";
import { Title } from "@/components/antd-sub-components";
import Image from "next/image";

const GetStartedCar = ({ next }: { next: () => void }) => {
  const form = Form.useFormInstance();
  const onClick = (car: string) => () => {
    form.setFieldValue("car", car);
    next();
  };
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12}>
        <Card
          className=" hover:border-primary cursor-pointer group !p-1"
          onClick={onClick("coupe")}
        >
          <Image
            src="/images/vehicle/coupe.png"
            alt="coupe"
            width={64}
            height={64}
            className="group-hover:scale-105 transition ease-in-out rounded-full"
          />
          <Title level={5} className=" !mt-4 !mb-0 group-hover:!text-primary">
            Coupe
          </Title>
        </Card>
      </Col>
      <Col xs={24} sm={12}>
        <Card
          className=" hover:border-primary cursor-pointer group !p-1"
          onClick={onClick("sedan")}
        >
          <Image
            src="/images/vehicle/sedan.png"
            alt="sedan"
            width={64}
            height={64}
            className="group-hover:scale-105 transition ease-in-out rounded-full"
          />
          <Title level={5} className=" !mt-4 !mb-0 group-hover:!text-primary">
            Sedan
          </Title>
        </Card>
      </Col>
      <Col xs={24} sm={12}>
        <Card
          className=" hover:border-primary cursor-pointer group !p-1"
          onClick={onClick("suv")}
        >
          <Image
            src="/images/vehicle/suv.png"
            alt="suv"
            width={64}
            height={64}
            className="group-hover:scale-105 transition ease-in-out rounded-full"
          />
          <Title level={5} className=" !mt-4 !mb-0 group-hover:!text-primary">
            SUV
          </Title>
        </Card>
      </Col>
    </Row>
  );
};

export default GetStartedCar;
