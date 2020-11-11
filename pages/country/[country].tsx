import React, { FC, Fragment } from "react";
import styled from "styled-components";
import Card from "../../components/Card";
import { StyledH2 } from "../../components/Homepage";
import { CountryProps } from "../index";

type CountryDetails = {
  country: CountryProps;
  countryBorders: CountryProps[];
};

const CountryContainer = styled.div`
  padding: 0 16px;
  margin-bottom: 24px;
`;

const CountryFlag = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

const CountryFlagImg = styled.img`
  max-width: 290px;
`;

const CountryDetailsContainer = styled.div`
  border: 1px solid #333333;
  padding: 16px;
  line-height: 22px;
`;

const BordersContainer = styled.div`
  display: flex;
  overflow-x: auto;
  height: 360px;
  padding: 4px;
`;

const CountryFlagContainer = styled.div`
  :not(:last-of-type) {
    margin-right: 16px;
  }
`;

const CountryDetailsInfo = styled.p``;

const BackButtonContainer = styled.div`
  margin-bottom: 16px;
`;

const BackButton = styled.button`
  outline: none;
  border: 1px solid #333;
  background: none;
  padding: 4px 8px;
  cursor: pointer;
`;

const CountryDetails: FC<CountryDetails> = ({ country, countryBorders }) => {
  const handleClick = () => {
    window.history.go(-1);
  };

  return (
    <>
      <CountryContainer>
        <BackButtonContainer>
          <BackButton onClick={handleClick}>Back</BackButton>
        </BackButtonContainer>
        <CountryFlag>
          <CountryFlagImg src={country.flag} alt="country flag" />
        </CountryFlag>
        <CountryDetailsContainer>
          <StyledH2>{country.name}</StyledH2>
          <CountryDetailsInfo>
            Captial City: {country.capital}
          </CountryDetailsInfo>
          <CountryDetailsInfo>
            Population: {country.population}
          </CountryDetailsInfo>
          <CountryDetailsInfo>
            Currencies:{" "}
            {country.currencies.map((currency, index) => {
              return <span key={index}>{currency.code}</span>;
            })}
          </CountryDetailsInfo>
          <CountryDetailsInfo>
            Languages:{" "}
            {country.languages.map((languages, index) => {
              return <Fragment key={index}>{languages.name} </Fragment>;
            })}
          </CountryDetailsInfo>
        </CountryDetailsContainer>
      </CountryContainer>
      {countryBorders.length > 0 && (
        <>
          <StyledH2>Bordering Countries</StyledH2>
          <BordersContainer>
            {countryBorders.map((country, index) => {
              return (
                <CountryFlagContainer key={index}>
                  <Card
                    href={`/country/${country.alpha3Code}`}
                    imgSrc={country.flag}
                    imgAlt="country flag"
                    title={country.name}
                    cardInfo={[
                      `Capital City: ${country.capital}`,
                      `Population: ${country.population}`,
                      `Region: ${country.region}`,
                    ]}
                    cardType={"SMALL"}
                  />
                </CountryFlagContainer>
              );
            })}
          </BordersContainer>
        </>
      )}
    </>
  );
};

export async function getStaticPaths() {
  const res = await fetch("https://restcountries.eu/rest/v2/all");
  const data = await res.json();

  const paths = data.map((country) => ({
    params: { country: country.alpha3Code },
  }));

  return { paths, fallback: false };
}

export const getStaticProps = async (ctx: any) => {
  const countryCode = ctx.params.country;
  const res = await fetch(
    `https://restcountries.eu/rest/v2/alpha/${countryCode}`
  );
  const countryData = await res.json();
  const countryBorders = await Promise.all(
    countryData.borders.map(async (code) => {
      const res = await fetch(`https://restcountries.eu/rest/v2/alpha/${code}`);
      const borderingCountryData = await res.json();
      return borderingCountryData;
    })
  );

  return {
    props: { country: countryData, countryBorders },
  };
};

export default CountryDetails;
