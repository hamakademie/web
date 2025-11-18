# HAM Akademie.cz
HAM Akademie je výukový portál pro zájemce, kteří se chtějí připravit na zkoušky a následně se stát radioamatéry v České Republice. 

Živou verzi portálu najdeš na adrese [https://hamakademie.cz](https://hamakademie.cz).


## Development
Pracovní verzi webu pro vývoj lze rozjet lokálně pomocí `docker-compose.yml` souboru. Předpokládáme tedy, že máš nainstalovaný `Docker` a `docker-compose` (nebo `podman`).


### Setup
Pokud si ještě lokálně nevyvíjel, je potřeba vybuildit docker image:
- `docker-compose up installer --build`

Pokud máš již image připravený, spusť lokální dev server:
- `docker-compose up dev-server`

Poté otevřeš [http://0.0.0.0:5173/](http://0.0.0.0:5173/) a můžeš psát!