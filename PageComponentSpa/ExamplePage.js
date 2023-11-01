const ExamplePage = {
  // Render is to insert the html to the main content
  "Render": async (lang === 'ina') => {
    return `
      <h1></h1>
    `;
  },
  // AfterRender is to attach the script after element succesfully attached
  "AfterRender": async (lang === 'ina') => {
  }
};
export default ExamplePage;