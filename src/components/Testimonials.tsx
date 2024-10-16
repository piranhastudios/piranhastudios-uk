import Image from "next/image";
import React from "react";
import { Container } from "@/components/Container";

import userOneImg from "../../public/img/brands/skeendeep.png";
import userTwoImg from "../../public/img/team/eddy.jpeg";
import userThreeImg from "../../public/img/brands/elite-oils.png";

export const Testimonials = () => {
  return (
    <Container>
      <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-3">
        <div className="lg:col-span-2 xl:col-auto">
          <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-14 rounded-2xl py-14 dark:bg-trueGray-800">
            <p className="text-2xl leading-normal ">
              My time <Mark>is my own again!</Mark>
              The training and tools provided have really helped our business be more efficient.
            </p>

            <Avatar
              image={userOneImg}
              name="Dr Adeline Afong"
              title="Founder and head of Skeendeep Medical Aesthetics"
            />
          </div>
        </div>
        <div className="">
          <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-14 rounded-2xl py-14 dark:bg-trueGray-800">
            <p className="text-2xl leading-normal ">
              The things this team make are<Mark>amazing!</Mark>.
            </p>

            <Avatar
              image={userTwoImg}
              name="Eddy Ankrett"
              title="Chairman of the Dating Agency Association"
            />
          </div>
        </div>
        {/*<div className="">*/}
        {/*  <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-14 rounded-2xl py-14 dark:bg-trueGray-800">*/}
        {/*    <p className="text-2xl leading-normal ">*/}
        {/*      I really like the monthly package, it really shows you&apos;re <Mark>dedication</Mark> to growing with us.*/}
        {/*    </p>*/}

        {/*    <Avatar*/}
        {/*      image={userThreeImg}*/}
        {/*      name="Rob Barnfield"*/}
        {/*      title="Founder and owner of Elite Oils"*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </Container>
  );
};

interface AvatarProps {
  image: any;
  name: string;
  title: string;
}

function Avatar(props: Readonly<AvatarProps>) {
  return (
    <div className="flex items-center mt-8 space-x-3">
      <div className="flex-shrink-0 overflow-hidden rounded-full w-14 h-14">
        <Image
          src={props.image}
          width="40"
          height="40"
          alt="Avatar"
          placeholder="blur"
        />
      </div>
      <div>
        <div className="text-lg font-medium">{props.name}</div>
        <div className="text-gray-600 dark:text-gray-400">{props.title}</div>
      </div>
    </div>
  );
}

function Mark(props: { readonly children: React.ReactNode }) {
  return (
    <>
      {" "}
      <mark className="text-red-800 bg-red-100 rounded-md ring-red-100 ring-4 dark:ring-red-900 dark:bg-red-900 dark:text-red-200">
        {props.children}
      </mark>{" "}
    </>
  );
}
