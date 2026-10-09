NEW DHARANI HOSPITALS - Single page website (frontend only)

HOW TO RUN
  Double-click index.html (works offline except Google Fonts, which need internet).
  Or run "npm run dev" and open the local URL printed in the terminal. If port 5173 is busy, the server tries the next available port.
  To deploy: upload this whole folder to Vercel / Netlify / any hosting.

FOLDERS
  index.html      - complete page
  css/style.css   - light classy theme (mint white, emerald green, rose gold, coral accents), all animations
  js/script.js    - preloader, counters, reveal, doctor filter, form (sends to WhatsApp), particles
  images/         - replace these files with your final photos (same file names)

IMAGES TO REPLACE / ADD (same names, .jpg)
  logo.png                        (logo, now cropped from video; replace with original)
  hospital.jpg                    (building photo)
  dr-kallam-sekhar-reddy.jpg      (present)
  dr-gudenti-srinivas.jpg         (present)
  dr-pranathi-varrey.jpg          (add)
  dr-vnvr-satish.jpg              (add)
  dr-y-n-gowtham-rayudu.jpg       (add)
  dr-chandini-kottla.jpg          (add)
  dr-harish.jpg                   (add)
  dr-b-omkar-phani-krishna.jpg    (add)
  Doctors without an available photo use a gold monogram and do not request missing image files.
  To add a portrait, add the image and replace that doctor's monogram placeholder in index.html with an image element. Portrait size ~ 444x564.

COLOURS (css/style.css, top :root)
  Emerald #0C4A3F, Green #16705E, Rose gold #D7A08F, Crimson #9E1B34 (from logo)
