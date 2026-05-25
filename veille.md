\# Veille technologique — Yacine Djadel



\## Sources suivies (consultation hebdomadaire via Feedly)



\- \*\*symfony.com/blog\*\* → actualités et nouvelles fonctionnalités Symfony

\- \*\*blog.docker.com\*\* → bonnes pratiques Docker et conteneurisation

\- \*\*changelog.githubactions.com\*\* → évolutions de GitHub Actions

\- \*\*cert.ssi.gouv.fr\*\* → bulletins de sécurité français (CERT-FR)

\- \*\*thoughtworks.com/radar\*\* → tendances architecture (semestriel)



\## Fréquence de consultation



Consultation hebdomadaire chaque lundi via Feedly (agrégateur RSS).

Le CERT-FR est consulté dès qu'un bulletin critique est publié.



\## Sujets explorés récemment



\### Docker BuildKit — Optimisation du cache de build

Source : blog.docker.com

Docker BuildKit permet de mettre en cache les dépendances npm et Composer

entre les builds grâce à `--mount=type=cache`. Sur MyBank, cela pourrait

réduire le temps de build CI de 40%. À intégrer dans une prochaine itération

du pipeline.



\### GitHub Actions — Nouvelles fonctionnalités 2025

Source : changelog.githubactions.com

GitHub Actions supporte désormais les runners ARM natifs, ce qui réduit

le coût et le temps des builds pour les images Docker multi-architecture.

Pertinent pour MyBank si on vise un déploiement sur des serveurs ARM

comme les Ampere d'OVH.



\### CERT-FR — Veille sécurité Symfony

Source : cert.ssi.gouv.fr

Surveillance régulière des CVE affectant Symfony et ses composants.

Mon projet utilise Symfony 8.0 — je vérifie à chaque bulletin que

la version utilisée n'est pas concernée. Dependabot est configuré

pour créer automatiquement des PR de mise à jour.



\## Évolution prévue



\- Ajouter le podcast \*\*IfThenElse\*\* (francophone) pour la veille audio

\- Tester \*\*Obsidian\*\* pour structurer les notes de veille de façon

&#x20; permanente plutôt que de juste lire les articles

\- Explorer le \*\*ThoughtWorks Technology Radar\*\* prochain (semestriel)

&#x20; pour anticiper les tendances architecture 2026

