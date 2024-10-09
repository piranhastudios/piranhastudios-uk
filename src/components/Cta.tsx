import React from "react";
import { Container } from "@/components/Container";

export const Cta = () => {
  return (
    <Container>
      <div className="flex flex-wrap items-center justify-between w-full max-w-4xl gap-5 mx-auto text-white bg-red-600 px-7 py-7 lg:px-12 lg:py-12 lg:flex-nowrap rounded-xl">
        <div className="flex-grow text-center lg:text-left">
          <h2 className="text-2xl font-medium lg:text-3xl">
            Tell Us Your Vision, and We&apos;ll Bring It to Life.
          </h2>
          <p className="mt-2 font-medium text-white text-opacity-90 lg:text-xl">
            Grow your business today.
          </p>
        </div>
        <div className="flex-shrink-0 w-full text-center lg:w-auto">
          <a
            href="https://calendly.com/piranha-consultation/follow-up-meeting"
            target="_blank"
            rel="noopener"
            className="inline-block py-3 mx-auto text-lg font-medium text-center text-red-600 bg-white rounded-md px-7 lg:px-10 lg:py-5 "
          >
            Book a Consultation
          </a>
        </div>
      </div>
    </Container>
  );
};
