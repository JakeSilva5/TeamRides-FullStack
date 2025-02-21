import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: #0A2540;
    color: white;
    font-family: 'ClearviewHwy', 'Montserrat', sans-serif;
  }

  a {
    color: #4CC9F0;
    text-decoration: none;
  }

  h1, h2, h3 {
    font-family: 'ClearviewHwy', sans-serif;
  }

  button {
    font-family: 'Montserrat', sans-serif;
    background-color: #007BFF;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;
  }

  button:hover {
    background-color: #0056b3;
  }
`;

export default GlobalStyle;
