<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- <meta name="theme-color" content="#e2e2e2"/> -->
  <!-- <link rel="apple-touch-icon" href="image/logo_askara/png/askara_x48.png"> -->
  <!-- <link rel="icon" href="image/logo_askara/ico/askara_x128.ico" type="image/x-icon" /> -->
  <!-- <link rel="manifest" href="js/web.webmanifest"> -->

  <title>Examplae Of The Main Page</title>

</head>
<body>
  <!-- <script src="js/register.js"></script> -->

  <main id="mainContent">
  </main>

  <footer class="py-4 px-5">
    <i class="fas fa-copyright pe-1"></i>
    <span>2022 PT Askara Internal</span>
  </footer>

  <script type="module">
    import App from './scripts/utilities/app.js';
    const app = new App({
      content: document.querySelector('#mainContent'),
    })

    window.addEventListener('hashchange', async () => {
      await app.renderPage();
    });

    window.addEventListener('load', async () => {
      await app.renderPage();
    });
  </script>

</body>
</html>