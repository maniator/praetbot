[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://azuredeploy.net/)

#Deploying to an Azure site
1. [create an azure account](https://account.windowsazure.com/Home/Index)
2. `npm install -g azure-cli`
3. switch to asm (Azure Service Management ) mode `azure config mode asm`
4. login to your azure account `azure login`
	- should open a browser window to log into you azure account
5. create an azure site `azure site create --git {appname}`
6. set up git credentials if you have not already
7. `git push azure master`
 

