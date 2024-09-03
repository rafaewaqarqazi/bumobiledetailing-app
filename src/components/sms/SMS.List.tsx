import React, { useEffect, useRef } from "react";
import SMSItem from "@/components/sms/SMS.Item";
import { ISMS } from "@/utils/crud/sms.crud";

const SmsList = ({
  messages,
  background,
  size,
}: {
  messages: ISMS[];
  background?: string;
  size?: string;
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <>
      <div
        className={`message-list ${background === "white" ? "bg-white" : ""} ${
          size === "large" ? "lg" : ""
        }`}
      >
        {messages?.map((message) => (
          <SMSItem
            item={message}
            key={message.id}
            timeSeparate={background === "white"}
          />
        ))}
      </div>
      <div ref={messagesEndRef} />
    </>
  );
};

export default SmsList;
