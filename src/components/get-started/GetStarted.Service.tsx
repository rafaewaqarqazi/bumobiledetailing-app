import React from "react";
import { Card, Col, Form, Row } from "antd";
import { Title } from "@/components/antd-sub-components";
import Image from "next/image";
import { useServices } from "@/hooks/service.hooks";
import { IService } from "@/utils/crud/service.crud";

const GetStartedService = ({ next }: { next: () => void }) => {
  const form = Form.useFormInstance();
  const { services } = useServices({ withAllRelations: true });
  const onClick = (_service: IService) => () => {
    form.setFieldValue("service", _service);
    next();
  };
  return (
    <Row gutter={[16, 16]}>
      {services.map((service) => (
        <Col xs={24} sm={12} key={service.id}>
          <Card
            className="!p-1 hover:border-primary cursor-pointer group"
            onClick={onClick(service)}
          >
            <Image
              src={service.image}
              alt={service.name}
              width={64}
              height={64}
              className="group-hover:scale-105 transition ease-in-out rounded-2xl"
            />
            <Title level={5} className="!mt-4 !mb-0 group-hover:!text-primary">
              {service.name}
            </Title>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default GetStartedService;
