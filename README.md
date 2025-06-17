Forked from Forked from https://github.com/ashtom/book-box that was forked from https://github.com/amorriscode/book-box.

Migrated to use Hardcover API instead of GoodReads as they don't offer API access anymore.

---

<p align="left">
  <h3 align="left">book-box-hardcover</h3>
  <p align="left">📚Update a pinned gist to contain your latest reads on Hardcover.app</p>
</p>

---

📌✨ For more pinned-gist projects like this one, check out: https://github.com/matchai/awesome-pinned-gists

## Setup

### Prep work

1. [Create a new public GitHub Gist](https://gist.github.com/)
2. [Create a token with the `gist` scope and copy it.](https://github.com/settings/tokens/new)
![GitHub Token Gist Permission](readme_images/gh_token_gist_permission.png)
3. [Create a Hardcover account](http://hardcover.app/)
4. [Get your API key for the Hardcover API](https://hardcover.app/account/api)

### Project setup

1. Fork this repo
2. Go to the repo **Settings > Secrets**
3. Add the following environment variables:
  - **GIST_ID:** The ID of the gist you created above (`https://gist.github.com/amorriscode/`**`3f84910b524db4819ec2dc1063f632ab`**).
  - **GH_TOKEN:** The GitHub token generated above.
  - **HARDCOVER_KEY:** The API key for the Hardcover API. (Don't copy the `Bearer ` prefix.)

## Inspiration

This gist was inspired by [matchai's](https://github.com/matchai) [bird-box](https://github.com/matchai/bird-box).

## Timestamps

* 2025-06-17
