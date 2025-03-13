import { Global } from "@emotion/react";

export const GlobalStyles = () => (
	<Global
		styles={`
      body, button, input, textarea, select {
        font-family: 'Quicksand', sans-serif !important;
      }
      
      h1, h2, h3, h4, h5, h6 {
        font-family: 'Quicksand', sans-serif !important;
      }
    `}
	/>
);
