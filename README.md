# performanceTest_exampleApplication
Aplicação de exemplo de uso do JMeter para testes de Performance.

# Config

JAVA 8 é requerido para rodar o JMeter (https://www.java.com/pt-BR/download/ie_manual.jsp?locale=pt_BR)

## Install JMeter
https://jmeter.apache.org/download_jmeter.cgi


## Install Plugin
Para melhor simular os cenários solicitados, utilizei o plugin Ultimate Thread Group para o JMeter:
https://jmeter-plugins.org/wiki/UltimateThreadGroup/
O plugin já está disponivel na pasta /resources do projeto
Para instalar, apenas extraia os arquivos para a pasta do JMeter na mesma estrutura que eles estão dentro do ZIP(mais informações no site do plugin)


# How to run

No terminal, navegue até a pasta aonde o JMeter foi instalado e execute o seguinte comando ajustando os caminhos:
```
jmeter -n -t /pasta/do/seu/test.jmx -l /pasta/para/salvar/results.csv
```

Caso queira gerar um relatório de execução, execute o comando abaixo ajustando os caminhos:
```
jmeter -n -t /pasta/do/seu/test.jmx -l /pasta/para/salvar/results.csv -e -o /pasta/do/relatorio
```



# Desafio: Desenvolva um script de performance para o seguinte cenário:
URL: https://www.blazedemo.com

Cenário: 
* Compra de passagem aérea - Passagem comprada com sucesso.

Critério de Aceitação:
* 250 requisições por segundo com um tempo de resposta 90th percentil inferior a 2 segundos.

Instruções
* Escolha entre JMeter e Gatling
* Monte um teste de carga e um teste de pico que satisfaçam a vazão do critério de aceitação.
* Anexe o relatório da execução, e explique se o critério de aceitação foi satisfatório ou não, além dos motivos que te levaram a essa conclusão.
* Crie o repositório no GitHub (público) e COPIE E COLE o link aqui. Desenvolva a automação e suba o código no repositório (dica: crie primeiro o repositório, copie o link, cole neste campo e submeta o formulário).
* Não se esqueça do README.md, que deve conter
   - Instruções para a execução do script
   - Relatório de execução dos testes
   - Demais considerações pertinentes ao teste


# Relatório

Spike: Durante os testes de Spike a aplicação manteve o tempo de resposta do 90th Percentil sempre superior a 2s, tendo como menor valor 2.1s e maior valor 2.5s sendo assim a aplicação não está performando bem durante picos de uso.

Carga: A aplicação se comportou bem dentro do teste de carga, porém em alguns momentos quando haviam 250 vus ativas ela acabou subindo um pouco o tempo de resposta até o maximo de 2.3s, nos demais tempo ela oscilou entre 1.8s e 2.1s.