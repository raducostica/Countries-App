import React, { FC, useState } from "react";
import Homepage from "../components/Homepage";

export type CountryProps = {
  name: string;
  capital: string;
  alpha3Code: string;
  region: string;
  population: number;
  latlng: [number, number];
  timezones: [string];
  borders: string[];
  currencies: {
    code: string;
    name: string;
    symbol: string;
  }[];
  languages: {
    iso639_1: string;
    iso639_2: string;
    name: string;
    nativeName: string;
  }[];
  flag: string;
};

type IndexProps = {
  countries: CountryProps[];
  totalCountries: number;
  allCountries: CountryProps[];
};

const Index: FC<IndexProps> = ({ countries, totalCountries, allCountries }) => {
  const [scrollToTop, setScrollToTop] = useState<boolean>(false);

  return (
    <Homepage
      scrollToTop={scrollToTop}
      setScrollToTop={setScrollToTop}
      allCountries={allCountries}
      countries={countries}
      totalCountries={totalCountries}
    />
  );
};

export const getServerSideProps = async (ctx: any) => {
  const res = await fetch("https://restcountries.eu/rest/v2/all");
  const data = await res.json();
  const page = ctx.query.page || 1;
  const currentIndex = 25 * page - 25;
  const countries = data.slice(currentIndex, currentIndex + 25);

  return {
    props: {
      countries,
      totalCountries: data.length,
      allCountries: data,
    },
  };
};

export default Index;
