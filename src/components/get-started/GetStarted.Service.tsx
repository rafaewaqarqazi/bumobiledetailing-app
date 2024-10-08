import React from "react";
import { Card, Col, Form, Row } from "antd";
import { Title } from "@/components/antd-sub-components";
import Image from "next/image";
import { useServices } from "@/hooks/service.hooks";
import { IService } from "@/utils/crud/service.crud";
import { ICustomer } from "@/utils/crud/customer.crud";
import { IVehicle } from "@/utils/crud/vehicle.crud";
import { customerServiceCrud } from "@/utils/crud/customerService.crud";

const GetStartedService = ({
  next,
  customer,
}: {
  next: () => void;
  customer: ICustomer | null;
}) => {
  const form = Form.useFormInstance();
  const vehicle: IVehicle = Form.useWatch("vehicle", form);
  const { services } = useServices({ withAllRelations: true });
  const onClick = (_service: IService) => () => {
    form.setFieldValue("service", _service);
    if (customer?.id) {
      customerServiceCrud
        .create({
          customer: customer?.id,
          service: _service?.id,
          vehicle: vehicle?.id,
        })
        .catch((err) => {
          console.error(err);
        });
    }

    next();
  };
  return (
    <Row gutter={[16, 16]}>
      {services.map((service) => (
        <Col xs={24} sm={8} key={service.id}>
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
