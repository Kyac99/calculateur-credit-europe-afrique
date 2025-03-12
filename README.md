# Simulateur de Crédit Bancaire - Europe & Afrique de l'Ouest

Un outil web permettant de calculer et comparer des crédits bancaires en Europe et en Afrique de l'Ouest (UEMOA), avec prise en charge des devises EUR (€) et XOF (FCFA).

## Fonctionnalités

- Calcul de crédit pour différentes régions (Europe, Afrique de l'Ouest)
- Prise en charge de différentes devises (Euro, Franc CFA)
- Ajustement automatique des taux selon la région
- Différents types de prêts (personnel, immobilier, automobile, professionnel)
- Calcul détaillé des frais (dossier, assurance, garantie)
- Tableau d'amortissement complet
- Comparaison d'options (durées et taux différents)
- Interface intuitive et réactive

## Comment utiliser

1. Sélectionnez votre région (Europe ou Afrique de l'Ouest)
2. Choisissez le type de prêt
3. Entrez le montant du prêt
4. Ajustez la durée du prêt à l'aide du curseur
5. Spécifiez le taux d'intérêt et la fréquence de remboursement
6. Ajoutez les frais additionnels applicables
7. Cliquez sur "Calculer" pour obtenir les résultats

## Onglets disponibles

- **Résumé** : Vue d'ensemble du crédit avec le coût total et la répartition des frais
- **Tableau d'amortissement** : Échéancier détaillé des remboursements
- **Comparaison** : Analyse comparative avec différentes durées et taux

## Spécificités régionales

### Europe
- Taux d'intérêt généralement plus bas
- Frais de dossier standard
- Assurance emprunteur modérée

### Afrique de l'Ouest (UEMOA)
- Taux d'intérêt plus élevés (+2.5 points en moyenne)
- Frais de dossier plus importants
- Assurance emprunteur majorée

## Technologies utilisées

- HTML5
- CSS3 (design responsive)
- JavaScript (calculs et dynamique)
- Pas de dépendances externes

## Installation locale

1. Clonez ce dépôt
```
git clone https://github.com/Kyac99/calculateur-credit-europe-afrique.git
```
2. Ouvrez le fichier `index.html` dans votre navigateur

## Captures d'écran

### Mode Europe (EUR)
L'interface adopte des tons bleus pour le mode Europe, avec des calculs basés sur la devise Euro.

### Mode Afrique de l'Ouest (FCFA)
L'interface passe en teinte verte pour le mode Afrique de l'Ouest, avec conversion automatique en Franc CFA.

## Types de prêts disponibles

1. **Prêt personnel**
   - Durée typique : 2-7 ans
   - Taux plus élevés
   - Montants plus faibles

2. **Prêt immobilier**
   - Durée typique : 10-25 ans
   - Taux plus avantageux
   - Montants élevés

3. **Prêt automobile**
   - Durée typique : 3-7 ans
   - Taux intermédiaires
   - Montants moyens

4. **Prêt professionnel**
   - Durée adaptée aux besoins de l'entreprise
   - Taux variables selon le risque
   - Montants adaptés au projet

## Frais pris en compte

- **Frais de dossier** : Pourcentage du montant emprunté, payé une seule fois à l'ouverture du crédit
- **Assurance emprunteur** : Pourcentage annuel calculé sur le capital initial
- **Frais de garantie** : Pourcentage du montant emprunté pour sécuriser le prêt

## À venir

- Graphiques de répartition des coûts
- Exportation PDF du plan de financement
- Options de remboursement anticipé
- Calcul de capacité d'emprunt
- Intégration avec des API de taux en temps réel
- Ajout de devises supplémentaires

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à proposer une pull request pour améliorer cet outil.

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.
