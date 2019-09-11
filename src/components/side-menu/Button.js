import styled, { css } from "styled-components";

export const Button = styled.span`
  cursor: pointer;
  height: 32px;
  width: 32px;
  background-color: #ffffff;
  box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.2);
  color: #000;
  background: white;
  border-radius: 50%;
  justify-content: center;

  ${props =>
    props.opened &&
    css`
      transform: scale(1) rotate(0deg);
      opacity: 1;
      transition-duration: ${props => props.delay}ms;
      transition-timing-function: ease-in;
    `}
  ${props =>
    !props.opened &&
    css`
      transform: scale(0) rotate(-45deg);
      opacity: 0;
      transition-duration: ${props => props.delay}ms;
      transition-timing-function: ease-in;
    `}

  &:hover {
    svg {
      color: #ccc;
    }
  }
`;

export const Icon = styled.span`
  vertical-align: text-bottom;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    height: 14px;
    box-sizing: content-box;
    background-size: cover;
    color: ${props => (props.active ? "#ccc" : "#000")};
  }
`;
