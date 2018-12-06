


# Overview

Webová aplikácia implementuje tri prípady použitia:
* úroveň obezity v USA
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Úroveň obezity v USA")
* štatistiky McDonaldov v USA
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Štatistiky McDonaldov v USA")
* McDonaldy v častiach Houston Texas
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "McDonaldy v častiach Houston Texas")

# Frontend
* na zobrazenie mapy a pridávanie vrstiev je použitý Mapbox
* štruktúra frontendu je implementovaná v `index.html` a logika (volania REST API) je v `application.js`
# Backend
* napísaný v `Pythone` s použitím microframeworku `Flask`
* použitý databázový adaptér `psycopg2`
* pripojenie na databázu v module `database.py`
* obsahuje REST API a dopytovanie do databázy
## Dáta
Na transformáciu dát z `geojson` fromátu do `Postgresql` bol použitý program `ogr2ogr`. Dáta z `OpenStreetMaps` boli importované použitím `osm2pgsql`.
* [McDonalds in USA](https://github.com/gavinr/usa-mcdonalds-locations/blob/master/mcdonalds.geojson)
* [USA](http://www.kodyaz.com/t-sql/list-of-us-states-abbreviations-for-sql-database-table.aspx)
* [Obesity rate](https://catalog.data.gov/dataset/national-obesity-by-state-b181b)
* [Houston Texas](https://www.openstreetmap.org)
## REST API
Server zachytáva 4 cesty:
* `/` - landing page a načítanie častí Houston Texas
* `/obesitycoloring` - ofarbenie štátov podľa úrovňe obezity
* `/statisticsperstate` - štatistika McDonaldov v USA
* `/houstonparts` - vo vybranej časti Houston Texas zobrazí McDonaldy
## Postgis
Dopyty do databázy sú v `queries.json`. Použité `postgis` funkcie:

* ST_Contains
* ST_Transofrm
* ST_AsGeoJSON
* ST_Centroid