"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Flex, Row, Space, Tag } from "antd";
import { useServices } from "@/hooks/service.hooks";
import Image from "next/image";
import { Paragraph, Title } from "@/components/antd-sub-components";
import { currencyFormatter } from "@/utils/helpers";
import Link from "next/link";
import { IServicePackage } from "@/utils/crud/service.crud";

const Pricing = () => {
  const [active, setActive] = useState(0);
  const { services } = useServices({});
  const sendHeight = () => {
    const height = document.body.scrollHeight;
    window.parent.postMessage(height, "*");
  };
  useEffect(() => {
    setActive(services?.[0]?.id || 0);
  }, [services]);
  useEffect(() => {
    sendHeight();
  }, [active]);
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.onload = sendHeight;
    window.onresize = sendHeight;
  }, []);
  const onClickService = (index: number) => () => {
    setActive(index);
    sendHeight();
  };
  const selectedService = useMemo(
    () => services?.find((service) => service.id === active),
    [active, services],
  );
  return (
    <div className="p-4">
      <Flex gap={16} justify="center" wrap="wrap" className="mb-4">
        {services?.map((service) => (
          <Button
            key={service.id}
            type={active === service.id ? "primary" : "default"}
            onClick={onClickService(service.id)}
            size="large"
            className="!px-8"
          >
            {service.name}
          </Button>
        ))}
      </Flex>
      <Space size={16} direction="vertical" className="w-full">
        {selectedService?.servicePackages
          ?.sort((a: IServicePackage, b: IServicePackage) => a.rank - b.rank)
          ?.map((_package) => {
            const description = _package.package?.description
              ?.split("\n")
              .filter(Boolean);
            const descriptionLength = description?.length || 0;
            const half = Math.ceil(descriptionLength / 2);
            return (
              <Card key={_package.package?.id} className="mt-4 !bg-bodyBG">
                <Flex
                  gap={16}
                  className="flex-col sm:flex-row sm:justify-center"
                >
                  <Flex align="center" className="flex-col">
                    <Image
                      src={_package.package?.image}
                      alt={_package.package?.name}
                      width={140}
                      height={140}
                    />
                    <Title
                      level={4}
                      className="!mt-0 !text-center !font-extrabold"
                    >
                      {_package?.package?.displayName}
                    </Title>
                  </Flex>
                  <div className="bg-white rounded-xl p-4 flex-grow sm:max-w-lg">
                    <Row>
                      <Col xs={24} sm={12}>
                        {description.slice(0, half).map((line) => (
                          <Paragraph key={line}>{line}</Paragraph>
                        ))}
                      </Col>
                      <Col xs={24} sm={12}>
                        {description.slice(half).map((line) => (
                          <Paragraph key={line}>{line}</Paragraph>
                        ))}
                      </Col>
                    </Row>
                  </div>
                  <div>
                    {_package?.isPopular && (
                      <Tag
                        color="red-inverse"
                        className="!absolute top-4 right-4"
                      >
                        Popular
                      </Tag>
                    )}
                    <Title level={2} className=" !text-center !font-extrabold">
                      {currencyFormatter.format(_package?.package?.price)}
                    </Title>
                    <Link href={"/get-started"}>
                      <Button
                        type={_package.isPopular ? "primary" : "default"}
                        danger={_package.isPopular}
                        size="large"
                        className="w-full sm:w-48"
                      >
                        Book & Save
                      </Button>
                    </Link>
                  </div>
                </Flex>
              </Card>
            );
          })}
      </Space>
    </div>
  );
};

export default Pricing;
