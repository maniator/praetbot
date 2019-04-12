
# Deploying to an Azure site 
1. [create an azure account](https://account.windowsazure.com/Home/Index)
2. `npm install -g azure-cli`

## Using arm
- `azure config mode arm`
- login to your azure account `azure login`
	- should open a browser window to log into you azure account
- `azure group create {resourceName} eastus` resource name can be anything such as _praetbot_
- copy and rename `azure/params.json.example` to `azure/params.json` using 
   ```sh
   cp azure/params.json.example azure/params.json
   ```
- change or provide the following options if necessary:
  * siteName: arbitrary site name (must not already be used on azure)
  * hostingPlanName: App Service Plan _used for grouping multiple sites into one hosting plan_ 
  * mongoServer:  _e.g. ...mlab.com/something_
  * mongoUser:  
  * mongoPassword:  
  * botApiKey:  _get this from slack/integrations_
  * repoURL: for private github repos this needs to be a repo **OWNED** by the user accessing it _(fork the repo)_ and not just entitled to another orgs repo
    [set up github repo continuous deployment after this deploy](https://github.com/blog/2056-automating-code-deployment-with-github-and-azure)
    
    **OR** create an access token 
     - use https://{GITHUB_USER}:{ACCESS_TOKEN}@github.com/{GITHUB_USER}/{REPO_NAME}.git
       e.g.  `https://maniator:**********************@github.com/maniator/praetbot.git`
     - find the deploy trigger webhook url under properties and add a webhook to the github repo to trigger on push

- `azure group deployment create -f azure/deploytoazure.json -e azure/params.json {resourceName}`

## Using asm
- switch to asm (Azure Service Management ) mode `azure config mode asm`
- login to your azure account `azure login`
	- should open a browser window to log into you azure account
- create an azure site `azure site create --git {appname}` arbitrary site name (must not already be used on azure)
- set up git credentials if you have not already
- `git push azure master`
- [set up github repo continuous deployment after this deploy](https://github.com/blog/2056-automating-code-deployment-with-github-and-azure)
- set the apps App Settings
    * MONGO_SERVER
    * MONGO_USER
    * MONGO_PASSWORD
    * BOT_API_KEY
- restart or redeploy the app

# from a public github account
[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://azuredeploy.net/)


 

