# blog-updates
scrape blog updates from the 435 blog website (https://seam.cs.umd.edu/purtilo/435/blog.html) and send emails with the new posts

## what
- parse rendered html from the blog url on a continuous basis and parse out new posts
- store state for already seen blog posts and only send emails if the state of the blog has updated   

## setup
- install deps `npm install`
- build `npm run build`
- setup email account with Less Secure App connections turned on 
- write the account details to .env (see .env.EXAMPLE for format)
- define the emails to send updates to in emails.txt separated by newlines

## run
you will want to run the blog-updater on a set time interval. you can do this with cronjobs   
use install_cron.sh or install it yourself

### Notes:
- will not capture images in the blog posts (todo feature)
