# Fontes territoriais — registro canônico

## 1. GeoSalvador — Censo 2010 e 2022 por bairro

**Status:** VERIFICADO E PÚBLICO para o subconjunto semântico aprovado.

- Provider: Prefeitura Municipal de Salvador / GeoSalvador
- Dataset: `censo_2010_e_2022_por_bairro`
- Service Item ID: `4cd441755e6349eab281f7dcd42f8ad8`
- Layer: `censo_2010_e_2022` (0)
- Object ID: `FID`
- Bairro: `NOME_BAIRR`
- Data Last Edit: maio/2025
- snapshot SHA-256 normalizado: `89b4bcc4d385cee338beb65c43b39d88951a1392a6c2886c89c7ea00fd17a420`
- probe run: `34099716985`
- probe commit: `efeb881c404ef9b0367a22bc2910ed0beced48fc`

### Métricas 2022 aprovadas

| Métrica | Campo | Unidade |
| --- | --- | --- |
| population_total | C001 | people |
| households_total | C026 | households |
| households_permanent | C027 | households |

### Correção semântica

`C002`, `C003`, `C004` e `C018` foram retirados do primeiro lote porque os valores observados não sustentam a interpretação inicial de contagens/unidades sem documentação adicional.

Não reintroduzir esses campos sem semântica e unidade comprovadas.

### Valores públicos verificados

| Território | População | Domicílios | Permanentes |
| --- | ---: | ---: | ---: |
| Chapada do Rio Vermelho | 20.106 | 9.100 | 9.099 |
| Nordeste de Amaralina | 20.628 | 9.045 | 9.041 |
| Santa Cruz | 21.494 | 9.917 | 9.916 |
| Vale das Pedrinhas | 6.129 | 2.580 | 2.580 |

## 2. GeoSalvador — Unidades Educacionais AGOL

**Status:** VERIFICADO E PÚBLICO para as unidades espacialmente contidas nos quatro boundaries.

- Provider: Prefeitura Municipal de Salvador / GeoSalvador
- Dataset: `Unidades_Educacionais_AGOL`
- Service Item ID: `58b52c0f4bf34ec99ed197201589745c`
- Layer: `unidades_educacao_a` (0)
- Data Last Edit: `2025-02-26T17:33:25.901Z`
- total da fonte no probe: 433
- dentro do MVP: 14
- fora do MVP: 419
- snapshot SHA-256 normalizado: `696604e2528b1608f041651be2fd76dc6de17331f4f37b8f35654a4b5d3c3c02`
- probe run: `34100743505`
- probe commit: `aa4ba9883cfd6763c9932fa35f48020f133bd715`

### Regra territorial

O campo textual `bairro` é somente diagnóstico.

A autoridade é:

```text
coordenada oficial
→ point-in-versioned-boundary
→ confirmação independente PostGIS ST_Covers
→ territory_id
```

O probe encontrou **8 divergências em 14 registros** entre o rótulo textual e o boundary real. Por isso, nenhum importador futuro pode atribuir território pelo texto livre.

### Distribuição

| Território | Unidades |
| --- | ---: |
| Chapada do Rio Vermelho | 3 |
| Nordeste de Amaralina | 2 |
| Santa Cruz | 8 |
| Vale das Pedrinhas | 1 |

## 3. Saúde

A camada municipal `Unidades_Saude` encontrada no GeoSalvador possui dados editados em 2022.

**Status:** NÃO APROVADA como fonte atual do MVP.

Próxima ação: localizar uma fonte oficial mais recente, preferencialmente municipal/estadual ou CNES, validar atualização/schema/coordenadas e aplicar o mesmo pipeline espacial.

## Política permanente

Nenhum dado territorial vira público apenas porque foi baixado.

Fluxo obrigatório:

```text
fonte oficial
→ probe reproduzível
→ artifact + SHA-256
→ snapshot privado
→ provisional
→ validação semântica/espacial
→ verified
→ leitura pública
```
