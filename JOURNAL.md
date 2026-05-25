\## Sécurité — OWASP Top 10



\### A01 — Broken Access Control

\*\*Ce qu'un attaquant peut faire\*\* : accéder aux dépenses d'un autre utilisateur

en changeant l'ID dans l'URL (ex: GET /api/expenses/42 alors que la dépense

appartient à quelqu'un d'autre).



\*\*Protection sur MyBank\*\* : chaque endpoint vérifie que la ressource demandée

appartient bien à l'utilisateur connecté via le système de Voters Symfony.

Un utilisateur ne peut lire, modifier ou supprimer que ses propres dépenses.



\---



\### A03 — Injection SQL

\*\*Ce qu'un attaquant peut faire\*\* : injecter du SQL malveillant dans les

paramètres de requête pour lire ou supprimer toute la base de données.



\*\*Protection sur MyBank\*\* : utilisation systématique de Doctrine ORM et de

ses paramètres nommés (setParameter). Aucune concaténation de chaîne dans

les requêtes. Doctrine échappe automatiquement toutes les valeurs.



\---



\### A05 — Security Misconfiguration

\*\*Ce qu'un attaquant peut faire\*\* : exploiter une configuration par défaut

pour obtenir des informations sensibles (stack trace, variables d'environnement).



\*\*Protection sur MyBank\*\* : APP\_ENV=prod en production (pas dev), les pages

d'erreur ne révèlent pas de stack trace, les conteneurs Docker n'exposent

que les ports nécessaires (80 pour le frontend, 9000 pour le backend en interne).



\---



\### A06 — Vulnerable and Outdated Components

\*\*Ce qu'un attaquant peut faire\*\* : exploiter une faille connue dans une

dépendance non mise à jour (CVE publique).



\*\*Protection sur MyBank\*\* : Dependabot est configuré pour créer automatiquement

des PR de mise à jour chaque semaine. Un job composer audit dans la CI

détecte les vulnérabilités connues à chaque push.

