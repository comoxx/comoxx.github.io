# comoxx.github.io

Personal website of Côme Hosxe: research, projects, publications and CV.

Live at **https://comoxx.github.io**.

## Content

| What | Where |
|---|---|
| About page and bio | `_pages/about.md` |
| News | `_news/` |
| Projects | `_projects/`, images in `assets/img/projects/`, videos in `assets/video/` |
| Publications | `_bibliography/papers.bib` |
| CV | `_data/cv.yml`, PDF in `assets/pdf/` |
| Social links | `_data/socials.yml` |

## Run locally

```bash
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000.

## Deployment

Every push to `main` builds the site with GitHub Actions (`.github/workflows/deploy.yml`) and publishes it to the `gh-pages` branch.

## Credits

Built with [Jekyll](https://jekyllrb.com/) and the [al-folio](https://github.com/alshedivat/al-folio) theme (MIT license, see `LICENSE`).
