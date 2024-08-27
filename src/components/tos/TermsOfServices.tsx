import React from "react";
import { Paragraph, Title } from "@/components/antd-sub-components";

const TermsOfServices = () => {
  return (
    <div className="max-h-[400px] overflow-y-auto">
      <Title level={4}>BU Mobile Detailing Service Agreement</Title>
      <Paragraph>
        By booking or using BU Mobile Detailing Mobile {`Detailing’s`} services,
        you (“Client” or “You”) agree to the following terms and conditions,
        which constitute a legal agreement between you and BU Mobile Detailing
        LLC (“Contractor”, “We”, “Us”, or “Our”).
      </Paragraph>
      <Title level={4}>Cancellation Policy</Title>
      <ul>
        <li>48+ hours notice: No fee</li>
        <li>24-48 hours notice: $80 fee</li>
        <li>Less than 24 hours notice: $150 fee</li>
        <li>No call/No show: Full service amount charged up to $250</li>
        <li>
          Client not present or vehicle unable to be detailed upon arrival: Full
          service amount charged up to $250
        </li>
        <li>
          BU Mobile Detailing reserves the right to cancel or reschedule based
          on staffing, traffic, weather, or equipment issues. Gift certificate
          appointments follow the same cancellation policy.
        </li>
      </ul>
      <Title level={4}>Late Arrival</Title>
      <Paragraph>
        BU Mobile Detailing reserves the right to arrive up to 120 minutes late.
        Sometimes job schedules are tight and we may need to push your
        appointment back a bit. Traffic can also have an impact on arrival
        times. We ask that you be patient with our arrival.
      </Paragraph>
      <Title level={4}>Vehicle Access, Operation & Service Quality</Title>
      <Paragraph>
        When booking our services, you agree to provide BU Mobile Detailing
        personnel with access and keys to your vehicle to perform auto-related
        services such as detailing, ceramic coating, tinting, wrap, wet sanding,
        and other cosmetic enhancement services. BU Mobile Detailing endeavors
        to perform services to a high standard, aiming for a clean, damage-free
        exterior and spotless interior. Any concerns must be communicated within
        24 hours of service completion. BU Mobile Detailing is not liable for
        concerns raised thereafter or if you do not participate in the final
        inspection.
      </Paragraph>
      <Title level={4}>
        Accidents, Pre-Existing Conditions & Limitation Of Liability
      </Title>
      <Paragraph>
        BU Mobile Detailing will document pre-existing damage but is not liable
        for pre-existing conditions. If damage occurs under BU Mobile
        {`Detailing’s`} care, you will be notified. BU Mobile Detailing provides
        no guarantees or warranties. Our maximum liability is limited to the
        amount you paid for the service giving rise to the claim. BU Mobile
        Detailing is not liable for any indirect, incidental, special,
        consequential, or punitive damages.
      </Paragraph>
      <Title level={4}>Fees, Service Terms & Payment</Title>
      <Paragraph>
        The fee for our services is the “Total Cost” indicated when you book
        online. If the job exceeds the estimate by over 20%, additional fees
        will be confirmed with you. Payment is due upon completion via Credit
        Card, Debit, or Cash. Late payments incur a 10% fee plus 0.5% daily
        interest until paid. You agree to pay BU Mobile {`Detailing’s`}{" "}
        collection costs if applicable.
      </Paragraph>
      <Title level={4}>Access Requirements</Title>
      <Paragraph>
        You must provide access to water and electricity for mobile detailing
        services. Failure to do so results in a $150 cancellation fee.
      </Paragraph>
      <Title level={4}>Safety</Title>
      <Paragraph>
        You must disclose any harmful substances in the vehicle prior to
        detailing. You are responsible for any health/safety issues arising from
        your vehicle.
      </Paragraph>
      <Title level={4}>Feedback, Termination & Governing Law</Title>
      <Paragraph>
        We welcome your feedback at hellow@bumobiledetailing.com. By booking our
        services, you agree that BU Mobile Detailing may use pictures of your
        vehicle for marketing purposes unless you object in writing. This
        agreement is governed by Oregon law. By booking and using BU Mobile
        {`Detailing’s`} services, you certify that you are authorized to agree
        to these terms on behalf of the vehicle’s legal owner and are 18+ years
        of age. You agree to indemnify and hold BU Mobile Detailing harmless
        from any claims or damages arising from your lack of authority to enter
        into this agreement.
      </Paragraph>
      <Title level={4}> Mandatory Gratuity Fee</Title>
      <Paragraph>
        If the Client does not show up for the final quality control check and
        inspection at the end of the job, a mandatory gratuity fee of 10% of the
        total service cost will be added to the invoice. This fee is
        non-negotiable if you are not able to go over the vehicle with the
        technician at the end of the job.
      </Paragraph>
      <Title level={4}>I Understand That</Title>
      <ul>
        <li>
          BU Mobile Detailing does not guarantee any specific outcomes or
          results with our work.
        </li>
        <li>
          Your payment to BU Mobile Detailing is expressly for the dedicated
          service time on your vehicle, not tied to the attainment of any
          specific outcome or result.
        </li>

        <li>
          BU Mobile Detailing limits its liability to the total dollar amount of
          each job.
        </li>
        <li>
          If the job takes 20% longer than anticipated we reserve the right to
          charge an extra dirty fee totaling $50 per every half hour on top of
          the total cost at the discretion of BU Mobile Detailing employees (We
          will ask you before proceeding with extra charge).
        </li>
        <li>All Sales Are Final.</li>
      </ul>
    </div>
  );
};

export default TermsOfServices;
