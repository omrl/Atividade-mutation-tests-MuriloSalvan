# Mutation Tests com Stryker

[![Build and Tests](https://github.com/omrl/Atividade-mutation-tests-MuriloSalvan/actions/workflows/node.js.yml/badge.svg?branch=master)](https://github.com/omrl/Atividade-mutation-tests-MuriloSalvan/actions/workflows/node.js.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=omrl_mutation-tests-MuriloSalvan&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=omrl_mutation-tests-MuriloSalvan)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=omrl_mutation-tests-MuriloSalvan&metric=coverage)](https://sonarcloud.io/summary/new_code?id=omrl_mutation-tests-MuriloSalvan)

Projeto baseado no primeiro trabalho de testes unitários ([prova01-unit-test-MuriloSalvan](https://github.com/omrl/prova01-unit-test-MuriloSalvan)), agora avaliado com **testes de mutação** usando o [Stryker Mutator](https://stryker-mutator.io/).

## O que é teste de mutação

O Stryker faz pequenas alterações no código-fonte (troca `>` por `>=`, `===` por `!==`, remove um `trim()`, esvazia uma string, muda uma regex etc.). Cada alteração é um **mutante**. Para cada mutante ele roda os testes de novo:

- **Killed**: algum teste falhou, ou seja, os testes perceberam a mudança.
- **Survived**: todos os testes passaram com o código alterado, ou seja, falta teste.
- **No coverage**: nenhum teste executa aquele trecho.

O **mutation score** é o percentual de mutantes mortos. A cobertura de código diz quais linhas foram executadas; o mutation score diz se os testes realmente verificam o que essas linhas fazem.

## Como executar

1. Instale o [Node JS](https://nodejs.org/) (versão >= 20)
1. `npm install`
1. `npm test` roda os testes unitários (Jest)
1. `npm run coverage` roda os testes com cobertura
1. `npm run mutation` roda os testes de mutação (Stryker)

O relatório HTML fica em `reports/mutation/mutation.html`. No GitHub Actions o relatório é publicado como artifact (`mutation-report`) em cada execução.

A configuração está em `stryker.config.json` (runner do Jest, mutando `src/**/*.js`). O build falha se o score ficar abaixo de 90%.

## Resultados

### Antes (testes do primeiro trabalho)

| Arquivo | Score | Killed | Survived | No cov |
|---|---|---|---|---|
| anagram.js | 84,62% | 11 | 2 | 0 |
| banco.js | 96,08% | 49 | 2 | 0 |
| calculator.js | 100% | 9 | 0 | 0 |
| carrinhoCompras.js | 96,50% | 193 | 7 | 0 |
| carro.js | 90,00% | 9 | 1 | 0 |
| cnh.js | 100% | 6 | 0 | 0 |
| contaBancaria.js | 85,51% | 118 | 16 | 4 |
| lista.js | 100% | 13 | 0 | 0 |
| pessoa.js | 100% | 4 | 0 | 0 |
| textoUtils.js | 78,95% | 60 | 11 | 5 |
| userService.js | 100% | 7 | 0 | 0 |
| utilitarios.js | 90,24% | 74 | 8 | 0 |
| **Total** | **90,80%** | **553** | **47** | **9** |

### Depois (com os novos testes)

| Arquivo | Score | Killed | Survived | No cov |
|---|---|---|---|---|
| anagram.js | 84,62% | 11 | 2 | 0 |
| banco.js | 100% | 51 | 0 | 0 |
| calculator.js | 100% | 9 | 0 | 0 |
| carrinhoCompras.js | 100% | 200 | 0 | 0 |
| carro.js | 90,00% | 9 | 1 | 0 |
| cnh.js | 100% | 6 | 0 | 0 |
| contaBancaria.js | 100% | 138 | 0 | 0 |
| lista.js | 100% | 13 | 0 | 0 |
| pessoa.js | 100% | 4 | 0 | 0 |
| textoUtils.js | 97,37% | 74 | 2 | 0 |
| userService.js | 100% | 7 | 0 | 0 |
| utilitarios.js | 98,78% | 81 | 1 | 0 |
| **Total** | **99,01%** | **603** | **6** | **0** |

Os testes unitários passaram de 101 para 130.

### O que os mutantes mostraram

- **Teste vazio**: o teste de `contarOcorrencias` (textoUtils) não tinha nenhum `expect`, então passava sempre. O Stryker mostrou os 5 mutantes do método como *No coverage*. O teste foi preenchido.
- **Valores de fronteira**: nada testava o limite exato. Sacar exatamente o saldo (`banco`) ou o saldo + limite (`contaBancaria`), `podeSacar(0)`, `ajustarLimite(0)`, `saldoNegativo` com saldo zero, `truncar` com tamanho 0 e com o tamanho exato do texto, `filtrarPorFaixaDePreco` com mínimo igual ao máximo e `itemMaisCaro` com empate de preço. Trocar `>` por `>=` passava despercebido.
- **Erro sem mensagem**: `toThrow()` sem mensagem aceita qualquer erro. Em `adicionarItem(null, 10)`, se a checagem `typeof nome !== "string"` for removida, `null.trim()` lança um `TypeError` e o teste continua passando. Agora os testes conferem a mensagem esperada.
- **Só o caso feliz**: `ehPalindromo` (utilitarios) só era testado com um palíndromo, então qualquer mutante que fizesse o método retornar sempre `true` sobrevivia. `ehNumero` não tinha caso com texto numérico (`"10"`). Em `gerarNumeroAleatorio`, trocar `* max` por `/ max` ainda gera um número entre 0 e 10; com `Math.random` mockado dá para conferir o valor exato.
- **Retornos antecipados**: em `transferir`, `podeSacar` e `sacar` têm a mesma regra, então remover um dos `if` não mudava nada. Os novos testes usam `jest.spyOn` para forçar cada um a falhar. Em `validarConta`, os testes invalidam um campo por vez e conferem que `bloqueada` e `encerrada` são status válidos.
- **Dados sem variação**: `removerItem` (carrinho) só era testado com um item, então "remover sempre o primeiro" passava. Faltavam casos com espaços nas pontas (`trim` do nome do item e do slug), espaços duplicados (`capitalizar`, `paraSlug`) e números no início (`somenteLetras` sem o `^`). Em `banco`, os testes usavam `toContainEqual`, que não percebe lixo no histórico inicial.

### Mutantes equivalentes

Os 6 sobreviventes restantes são **mutantes equivalentes**: o código muda, mas o comportamento observável é o mesmo, então nenhum teste consegue matá-los.

| Arquivo | Mutação | Por que é equivalente |
|---|---|---|
| anagram.js | `toLowerCase()` → `toUpperCase()` | as duas palavras são normalizadas do mesmo jeito, a comparação dá o mesmo resultado |
| anagram.js | `join("")` → `join("Stryker was here!")` | o mesmo separador é usado nos dois lados, a igualdade não muda |
| carro.js | `distancia > 0` → `distancia >= 0` | somar 0 na quilometragem não altera nada |
| textoUtils.js | `split(/\s+/)` → `split(/\s/)` em `contarPalavras` | as strings vazias geradas são removidas pelo `filter(Boolean)` |
| textoUtils.js | remove o `trim()` em `contarPalavras` | idem, o `filter(Boolean)` remove as pontas vazias |
| utilitarios.js | `toLowerCase()` → `toUpperCase()` em `ehPalindromo` | a string é comparada com ela mesma invertida, a caixa não importa |

## Estrutura

- `src`: código-fonte
- `test`: testes unitários (os testes novos ficam no bloco `mutation tests` de cada arquivo)
- `stryker.config.json`: configuração do Stryker
- `sonar-project.properties`: configuração do SonarCloud (a análise roda no GitHub Actions junto com a cobertura do Jest)
