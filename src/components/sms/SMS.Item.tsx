import React from "react";
import { Card, Typography } from "antd";
import calendar from "dayjs/plugin/calendar";
import { environment } from "@/utils/config";
import dayjs from "dayjs";
import { ISMS } from "@/utils/crud/sms.crud";
dayjs.extend(calendar);
const SmsItem = ({
  item,
  timeSeparate,
}: {
  item: ISMS;
  timeSeparate: boolean;
}) => {
  const renderMessage = (message: string) => {
    const urlRegEx = new RegExp(
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
      "gm",
    );

    let parts: any[] = message?.split(urlRegEx); // re is a matching regular expression
    if (parts?.length) {
      for (let i = 1; i < parts?.length || 0; i += 2) {
        parts[i] = (
          <a
            href={parts[i]}
            key={`link${i}`}
            target="_blank"
            rel="noreferrer"
            style={{ wordBreak: "break-word" }}
          >
            {parts[i]}
          </a>
        );
      }
    }

    return parts;
  };
  return (
    <div
      className={`message mb-2 ${item.from === environment.did ? "self" : ""}`}
    >
      <div className={` ${timeSeparate ? "time-outside" : ""}`}>
        <Card
          bordered={false}
          size="small"
          className="message-item"
          bodyStyle={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <Typography.Paragraph
            ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
            style={{ wordBreak: "break-word" }}
          >
            {renderMessage(item.message)}
          </Typography.Paragraph>
          {!timeSeparate && (
            <Typography.Text type="secondary" className="time">
              {dayjs(item.createdAt).calendar(null, {
                sameDay: "hh:mm A",
                lastDay: "[Yesterday] hh:mm A",
                lastWeek: "DD, MMM YYYY, hh:mm A",
                sameElse: "DD, MMM YYYY, hh:mm A",
              })}
            </Typography.Text>
          )}
        </Card>
        {timeSeparate && (
          <Typography.Text type="secondary" className="time">
            {dayjs(item.createdAt).calendar(null, {
              sameDay: "hh:mm A",
              lastDay: "[Yesterday] hh:mm A",
              lastWeek: "DD, MMM YYYY, hh:mm A",
              sameElse: "DD, MMM YYYY, hh:mm A",
            })}
          </Typography.Text>
        )}
      </div>
    </div>
  );
};
export default SmsItem;
