import React, { FC } from "react";
import styled from "styled-components";
import Link from "next/link";
import { Anchor } from "./Homepage";

type CardProps = {
  href: string;
  imgSrc?: string;
  imgAlt?: string;
  title?: string;
  cardInfo: any[];
  cardType?: "SMALL";
};

const CardContainer = styled.div<{ cardType: string }>`
  height: 100%;
  background: #ffffff;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  cursor: pointer;
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;

  @media only screen and (min-width: 800px) {
    flex-direction: ${({ cardType }) =>
      cardType === "SMALL" ? "column" : "row"};
  }
`;

const CardInfoContainer = styled.div`
  padding: 8px;
`;

const CardInfoItem = styled.p`
  margin-bottom: 4px;
`;

const CardImg = styled.img`
  width: 250px;
  max-height: 200px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
`;

const FlagContainer = styled.div<{ cardType: string }>`
  padding: 8px;
  flex: 1;
  @media only screen and (min-width: 800px) {
    flex: ${({ cardType }) => (cardType === "SMALL" ? "1" : "none")};
  }
`;

export const StyledH2 = styled.h2`
  font-size: 18px;
  line-height: 22px;
  font-weight: 600;
  padding-bottom: 8px;
`;

const Card: FC<CardProps> = ({
  href,
  imgSrc,
  imgAlt,
  cardInfo,
  title,
  cardType,
}) => {
  return (
    <Link href={href}>
      <Anchor>
        <CardContainer cardType={cardType}>
          <FlagContainer cardType={cardType}>
            <CardImg src={imgSrc} alt={imgAlt} />
          </FlagContainer>
          <CardInfoContainer>
            <StyledH2>{title}</StyledH2>
            {cardInfo.map((info, index) => {
              return <CardInfoItem key={index}>{info}</CardInfoItem>;
            })}
          </CardInfoContainer>
        </CardContainer>
      </Anchor>
    </Link>
  );
};

export default Card;
