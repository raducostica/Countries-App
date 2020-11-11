import React, { FC } from "react";
import styled, { keyframes } from "styled-components";

type CardProps = {
  cardType?: "SMALL";
};

const backgroundColorTransition = keyframes`
0%{
    background: #eeeeee;
}

50%{
    background: #dddddd;
}

100%{
    background: #d8d8d8;
}
`;

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
    flex-direction: ${({ cardType }) => (cardType ? "column" : "row")};
  }
`;

const CardInfoContainer = styled.div`
  padding: 24px;
`;

const CardInfoItem = styled.p`
  margin-bottom: 4px;
  width: 200px;
  height: 15px;
  animation: ${backgroundColorTransition} 2s ease-in forwards;
`;

const FlagContainer = styled.div`
  background: #dddddd;
  height: 150px;
  width: 250px;
  animation: ${backgroundColorTransition} 2s ease-in forwards;
`;

export const StyledH2 = styled.h2`
  margin-bottom: 8px;
  background: #dddddd;
  width: 200px;
  height: 25px;
  animation: ${backgroundColorTransition} 2s ease-in forwards;
`;

const Skeleton: FC<CardProps> = ({ cardType }) => {
  return (
    <CardContainer cardType={cardType}>
      <FlagContainer />
      <CardInfoContainer>
        <StyledH2></StyledH2>
        {[0, 1, 2].map((_, index) => {
          return <CardInfoItem key={index}></CardInfoItem>;
        })}
      </CardInfoContainer>
    </CardContainer>
  );
};

export default Skeleton;
