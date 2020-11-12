import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { CountryProps } from "../pages";
import Card from "./Card";
import Skeleton from "./Skeleton";
import Image from "next/image";

type HomepageProps = {
  countries: CountryProps[];
  totalCountries: number;
  allCountries: CountryProps[];
  scrollToTop: boolean;
  setScrollToTop?: any;
};

export const Anchor = styled.a`
  display: block;
  height: 100%;
  width: 100%;
`;

export const StyledH2 = styled.h2`
  font-size: 18px;
  line-height: 22px;
  font-weight: 600;
  padding-bottom: 8px;
`;

const InputWrapper = styled.div`
  width: 90%;
  margin: 40px auto;
  display: flex;
  @media only screen and (min-width: 600px) {
    width: 640px;
  }
`;

const InputContainer = styled.div`
  position: relative;
  flex: 1;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
`;

const InputSuggestionsContainer = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 150px;
  overflow: auto;
  background: #0080ff;
`;

const InputSuggestion = styled.li`
  list-style: none;
  text-transform: capitalize;
  padding: 8px 12px;
  cursor: pointer;
  width: 100%;
`;

const ActiveDropdownItem = styled.p`
  font-size: 14px;
  text-transform: capitalize;
`;

const DropdownMenu = styled.ul`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: blue;
  width: inherit;
`;

const DropdownMenuItem = styled.li`
  list-style: none;
  cursor: pointer;
  text-transform: capitalize;
  width: inherit;
  padding: 8px;
`;

const DropdownContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  font-size: 14px;
  background: #0080ff;
  padding: 8px;
  :hover ${DropdownMenu} {
    display: block;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

const PaginationNumbers = styled.div<{ isActive?: boolean }>`
  padding: 4px 8px;
  border: 1px solid #333333;
  margin: 0 4px;
  cursor: pointer;
  background: ${({ isActive }) => isActive && "blue"};
`;

const CardContainer = styled.div<{ animate?: any }>`
  margin-bottom: 24px;
  transition: opacity 2s ease-in-out;
  opacity: 0;
  @media only screen and (min-width: 800px) {
    height: 220px;
  }
  ${({ animate }) =>
    animate &&
    css`
      opacity: 1;
    `}
`;

const SkeletonContainer = styled.div`
  margin-bottom: 24px;
  @media only screen and (min-width: 800px) {
    height: 220px;
  }
`;

const Header = styled.header`
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  background: #333333;
  margin-bottom: 24px;
  overflow: hidden;
  @media only screen and (min-width: 800px) {
    height: 600px;
  }
`;

const Background = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  opacity: 0.5;
`;

type ItemsTop = {
  top: number;
  animate: boolean;
};

const Homepage: FC<HomepageProps> = ({
  allCountries,
  countries,
  totalCountries,
  scrollToTop,
  setScrollToTop,
}) => {
  const router = useRouter();
  const dropDownItems = ["country", "capital"];
  const [search, setSearch] = useState<string>("");
  const [activeDropdown, setActiveDropdown] = useState<number>(0);
  const [suggestions, setSuggestions] = useState<CountryProps[]>([]);
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [itemTops, setItemTops] = useState<ItemsTop[]>([]);
  const [scrollPos, setScrollPos] = useState<number>(0);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  const handleRouteChangeStart = () => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const updateScroll = () => {
    setScrollPos(
      (window.innerHeight || document.documentElement.clientHeight) +
        window.scrollY
    );
  };

  useEffect(() => {
    handleRouteChangeStart();

    updateScroll();

    document.addEventListener("scroll", updateScroll);

    return () => {
      document.removeEventListener("scroll", updateScroll);
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      itemsRef.current = itemsRef.current.slice(0, countries.length);
      let items = itemsRef.current.map((item) => {
        let bounds = item.getBoundingClientRect();
        return {
          top: bounds.top,
          animate:
            bounds.top <=
            (window.innerHeight || document.documentElement.clientHeight)
              ? true
              : false,
        };
      });

      setItemTops(items);
    }
  }, [loading]);

  useEffect(() => {
    const handleRouteChangeComplete = () => {
      if (scrollToTop) {
        window.scrollTo(0, 0);
      }
      setLoading(true);
    };

    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeStart", handleRouteChangeStart);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [scrollToTop]);

  const getSuggestions = (type: string, text: string) => {
    const suggestions = allCountries.filter((country, index) => {
      if (
        country[type].substring(0, text.length).toLowerCase() ===
        text.toLowerCase()
      )
        return country;
    });

    return suggestions;
  };

  useEffect(() => {
    const types = ["name", "capital"];
    setSuggestions(getSuggestions(types[activeDropdown], search));
  }, [search]);

  useEffect(() => {
    setSearch("");
  }, [activeDropdown]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const updateItemAnimation = (index: number) => {
    if (itemTops[index] && itemTops[index].top <= scrollPos) {
      let items = [...itemTops];
      let item = { ...items[index] };
      item.animate = true;
      items[index] = item;
      setItemTops(items);
    }
  };

  return (
    <>
      <Header>
        <Background>
          {countries.map((country, index) => {
            return (
              <Image key={index} src={country.flag} height={110} width={160} />
            );
          })}
        </Background>
        <InputWrapper>
          <DropdownContainer>
            <ActiveDropdownItem>
              {dropDownItems[activeDropdown]}
            </ActiveDropdownItem>
            <DropdownMenu>
              {dropDownItems.map((item, index) => {
                return (
                  <Fragment key={index}>
                    {activeDropdown !== index && (
                      <DropdownMenuItem
                        onClick={() => setActiveDropdown(index)}
                      >
                        {item}
                      </DropdownMenuItem>
                    )}
                  </Fragment>
                );
              })}
            </DropdownMenu>
          </DropdownContainer>
          <InputContainer>
            <Input
              type="text"
              onChange={handleSearchChange}
              value={search}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setSearch("")}
            />
            {search.length >= 2 && inputFocused && (
              <InputSuggestionsContainer
                onMouseDown={(e) => e.preventDefault()}
              >
                {suggestions.map((suggestion, index) => {
                  return (
                    <InputSuggestion key={suggestion.alpha3Code}>
                      <Link href={`/country/${suggestion.alpha3Code}`}>
                        <Anchor>
                          {suggestion[dropDownItems[activeDropdown]]
                            ? suggestion[dropDownItems[activeDropdown]]
                            : suggestion["name"]}
                        </Anchor>
                      </Link>
                    </InputSuggestion>
                  );
                })}
              </InputSuggestionsContainer>
            )}
          </InputContainer>
        </InputWrapper>
      </Header>
      {!loading &&
        countries.map((country, index) => {
          return (
            <CardContainer
              ref={(el) => (itemsRef.current[index] = el)}
              key={index}
              animate={
                itemTops[index] && itemTops[index].animate
                  ? itemTops[index].animate
                  : updateItemAnimation(index)
              }
            >
              <Card
                href={`/country/${country.alpha3Code}`}
                imgSrc={country.flag}
                imgAlt="country flag"
                title={country.name}
                cardInfo={[
                  `Capital City: ${country.capital}`,
                  `Population: ${country.population.toLocaleString()}`,
                  `Region: ${country.region}`,
                ]}
              />
            </CardContainer>
          );
        })}
      {loading &&
        Array(25)
          .fill(0)
          .map((_, index) => {
            return (
              <SkeletonContainer key={index}>
                <Skeleton />
              </SkeletonContainer>
            );
          })}
      <Pagination>
        {Array(totalCountries / 25)
          .fill(".")
          .map((item, index) => {
            let page: number = parseInt(router.query.page as any) || 1;
            return (
              <Fragment key={index}>
                {index === 0 ||
                index + 1 === totalCountries / 25 ||
                index + 1 === page - 1 ||
                index + 1 === page ||
                index + 1 === page + 1 ? (
                  <PaginationNumbers
                    onClick={() => {
                      router.push({
                        pathname: "/",
                        query: { page: index + 1 },
                      });
                      setScrollToTop(true);
                    }}
                    isActive={page === index + 1}
                  >
                    {index + 1}
                  </PaginationNumbers>
                ) : (
                  <Fragment key={index}>{item}</Fragment>
                )}
              </Fragment>
            );
          })}
      </Pagination>
    </>
  );
};

export default Homepage;
