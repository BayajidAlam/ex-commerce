import React from "react";
import Link from "next/link";
import categoryImage1 from "../../../public/categories/Symbol web-14.png";
import categoryImage2 from "../../../public/categories/Symbol web-15.png";
import categoryImage3 from "../../../public/categories/Symbol web-16.png";
import categoryImage4 from "../../../public/categories/Symbol web-17.png";
import Image from "next/image";

const Categories = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold mb-4">Our Categories</h1>
      <div className="flex justify-center items-center">
        <Link href={"/"}>
          <Image src={categoryImage1} alt="product" height={120} width={120} />
        </Link>
        <Link href={"/"}>
          <Image src={categoryImage2} alt="product" height={120} width={120} />
        </Link>{" "}
        <Link href={"/"}>
          <Image src={categoryImage3} alt="product" height={120} width={120} />
        </Link>{" "}
        <Link href={"/"}>
          <Image src={categoryImage4} alt="product" height={120} width={120} />
        </Link>
      </div>
    </div>
  );
};

export default Categories;
