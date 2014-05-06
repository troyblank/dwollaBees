# DwollaBees

This is a page speed monitoring tool for Dwolla.com.

## Commands
node web/server.js - runs web server for presentation  
node app/script.js - runs daily data grab  

* * *

## Pages we are monitoring
* https://dwolla.com
* https://dwolla.com/login
* https://dwolla.com/about
* https://dwolla.com/register

* * *

## What we are monitoring

### Google Page Speed
* score 
* numberResources
* numberStaticResources

### Web Page Test
* speedIndex (first view)
* loadTime (first view averaged with a repeat view)
* renderTime (first view averaged with a repeat view)
* pageSize (first view)
* numberJsResources (first view)
* jsResponseBytes (first view)
* numberCssResources (first view)
* cssResponseBytes (first view)
* numberImageResources (first view)
* imageResponseBytes (first view)
* numberOtherResources (first view)
* otherResponseBytes (first view)