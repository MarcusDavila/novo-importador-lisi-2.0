
SELECT COUNT (Contaapagar_pagamentoparcial.grupo) FROM Contaapagar_pagamentoparcial WHERE Contaapagar_pagamentoparcial.grupo = 1 AND Contaapagar_pagamentoparcial.empresa = 1 AND Contaapagar_pagamentoparcial.filial = 1 AND Contaapagar_pagamentoparcial.unidade = 1 AND Contaapagar_pagamentoparcial.sequencia = 854109;

SELECT codigo||'-'||descricao,codigo FROM situacaotributaria WHERE tipo = 'PIS' AND ativoinativo = 1;

SELECT codigo||'-'||descricao,codigo FROM situacaotributaria WHERE tipo = 'COFINS' AND ativoinativo = 1;

SELECT codigo||'-'||descricao,codigo FROM formalancamentointerna WHERE ativoinativo = 1 ORDER BY codigo;

SELECT TO_CHAR(COALESCE(fnc_define_horariolocal(1,1,1, 1, null, 1, 1, 1),'00:00:00')::TIMESTAMP,'YYYYMMDDHH24MISS');

SELECT TO_CHAR(COALESCE(fnc_define_horariolocal(1,1,1, 1, null, 1, 1, 1),'00:00:00')::TIMESTAMP,'YYYYMMDDHH24MISS');

SELECT impostos FROM Empresa_parametro WHERE Empresa_parametro.grupo =  1 AND Empresa_parametro.empresa = 1 AND Empresa_parametro.tipodocumento = 2 ;

SELECT COUNT(grupo) FROM contaapagar_despesaprocessoaduaneiro WHERE grupo = 1 AND empresa = 1 AND filial = 1 AND unidade = 1 AND sequencia = 0;

SELECT ARRAY_TO_STRING(( SELECT ARRAY(SELECT DISTINCT ' PROC.: '||contaapagar_despesaprocessoaduaneiro.numeroprocessoaduaneiro||' - VALOR: '|| contaapagar_despesaprocessoaduaneiro.valor	 FROM contaapagar_despesaprocessoaduaneiro WHERE grupo = 1 AND empresa = 1 AND filial  = 1 AND unidade = 1 AND sequencia = 0 )),',')::VARCHAR AS processo FROM contaapagar_despesaprocessoaduaneiro WHERE grupo = 1 AND empresa = 1 AND filial  = 1 AND unidade = 1 AND sequencia =  0 LIMIT 1;

SELECT empresa_configuracao.ativarreguaalfabeticacadastro, empresa_configuracao.selecionarcolunabrowsecadastro FROM empresa_configuracao WHERE grupo = 1 AND empresa = 1;

SELECT Cadastro.nomefantasia, Fnc_Formata_CnpjCpfCod(Cadastro.codigo) AS cadastrocodigo, Cadastro.razaosocial, Cadastro.fone, Cadastro.fax, Cadastro.celular, Cadastro.cep, Cadastro.endereco, Cadastro.numero, Cadastro.complemento, Cadastro.cidade, Cadastro.uf, Cadastro.bairro, Pais.nome AS paisnome, Cadastro.inscricaoestadual, NULL, Cadastro.codigo, Cadastro.tipo, Cadastro.numerocadastrocontribuinteestrangeiro, Cadastro.latitude, Cadastro.longitude FROM Cadastro  LEFT OUTER JOIN Pais ON Pais.codigo = Cadastro.pais  WHERE cadastro.exibirbrowsecadastro = 1 AND substr(Cadastro. nomefantasia,1,1)  IS NULL;

SELECT selecionarcolunabrowsecadastro FROM empresa_configuracao WHERE grupo = 1 AND empresa = 1;

SELECT Cadastro.nomefantasia, Fnc_Formata_CnpjCpfCod(Cadastro.codigo) AS cadastrocodigo, Cadastro.razaosocial, Cadastro.fone, Cadastro.fax, Cadastro.celular, Cadastro.cep, Cadastro.endereco, Cadastro.numero, Cadastro.complemento, Cadastro.cidade, Cadastro.uf, Cadastro.bairro, Pais.nome AS paisnome, Cadastro.inscricaoestadual, NULL, Cadastro.codigo, Cadastro.tipo, Cadastro.numerocadastrocontribuinteestrangeiro, Cadastro.latitude, Cadastro.longitude FROM Cadastro  LEFT OUTER JOIN Pais ON Pais.codigo = Cadastro.pais  WHERE cadastro.exibirbrowsecadastro = 1 AND (cadastro.nomefantasia like '%'||'ADAIR JOSE'||'%' OR cadastro.codigo like '%'||'ADAIR JOSE' ||'%' );

SELECT tipotitulopadrao FROM Cadastro_Vinculo_Parametro WHERE Cadastro_Vinculo_Parametro.grupo=1 AND Cadastro_Vinculo_Parametro.empresa=1 AND Cadastro_Vinculo_Parametro.cnpjcpfcodigo='98929453015' AND Cadastro_Vinculo_Parametro.vinculo=2;

 SELECT Fnc_Verifica_VinculoAtivoInativo(1,1,'98929453015',2);

SELECT Cadastro.razaosocial FROM Cadastro WHERE Cadastro.codigo = '98929453015';

SELECT ARRAY_TO_STRING(( SELECT ARRAY(SELECT DISTINCT ' PROC.: '||contaapagar_despesaprocessoaduaneiro.numeroprocessoaduaneiro||' - VALOR: '|| contaapagar_despesaprocessoaduaneiro.valor	 FROM contaapagar_despesaprocessoaduaneiro WHERE grupo = 1 AND empresa = 1 AND filial  = 1 AND unidade = 1 AND sequencia = 0 )),',')::VARCHAR AS processo FROM contaapagar_despesaprocessoaduaneiro WHERE grupo = 1 AND empresa = 1 AND filial  = 1 AND unidade = 1 AND sequencia =  0 LIMIT 1;

SELECT moeda.codigo FROM moeda JOIN cadastro ON cadastro.pais = moeda.pais WHERE cadastro.codigo = '98929453015';

SELECT TRUE FROM moeda JOIN unidade ON unidade.pais = moeda.pais WHERE moeda.codigo = 1 AND unidade.grupo = 1 AND unidade.empresa = 1 AND unidade.filial = 1 AND unidade.codigo = 1;

 SELECT Fnc_Verifica_VinculoAtivoInativo(1,1,'98929453015',2);

SELECT Cadastro.razaosocial FROM Cadastro WHERE Cadastro.codigo = '98929453015';

SELECT ARRAY_TO_STRING(( SELECT ARRAY(SELECT DISTINCT ' PROC.: '||contaapagar_despesaprocessoaduaneiro.numeroprocessoaduaneiro||' - VALOR: '|| contaapagar_despesaprocessoaduaneiro.valor	 FROM contaapagar_despesaprocessoaduaneiro WHERE grupo = 1 AND empresa = 1 AND filial  = 1 AND unidade = 1 AND sequencia = 0 )),',')::VARCHAR AS processo FROM contaapagar_despesaprocessoaduaneiro WHERE grupo = 1 AND empresa = 1 AND filial  = 1 AND unidade = 1 AND sequencia =  0 LIMIT 1;

SELECT moeda.codigo FROM moeda JOIN cadastro ON cadastro.pais = moeda.pais WHERE cadastro.codigo = '98929453015';

SELECT TRUE FROM moeda JOIN unidade ON unidade.pais = moeda.pais WHERE moeda.codigo = 1 AND unidade.grupo = 1 AND unidade.empresa = 1 AND unidade.filial = 1 AND unidade.codigo = 1;

SELECT * FROM Fnc_Verifica_Bloqueio_Contabilidade( 2, 1, 1, null, null, NULL, NULL, null, NULL, '2026-01-06', 4, NULL, NULL, NULL, NULL, 199, NULL, NULL, NULL, NULL, 'Menu Contabilidade', 'Liberar_Contabilidade_Window', 1);

SELECT Cadastro.razaosocial FROM Cadastro WHERE Cadastro.codigo = '98929453015';

SELECT ARRAY_TO_STRING(( SELECT ARRAY(SELECT DISTINCT ' PROC.: '||contaapagar_despesaprocessoaduaneiro.numeroprocessoaduaneiro||' - VALOR: '|| contaapagar_despesaprocessoaduaneiro.valor	 FROM contaapagar_despesaprocessoaduaneiro WHERE grupo = 1 AND empresa = 1 AND filial  = 1 AND unidade = 1 AND sequencia = 0 )),',')::VARCHAR AS processo FROM contaapagar_despesaprocessoaduaneiro WHERE grupo = 1 AND empresa = 1 AND filial  = 1 AND unidade = 1 AND sequencia =  0 LIMIT 1;

 Select tipoconta FROM planoconta WHERE grupo =1 AND reduzido = 366;

SELECT COUNT(grupo) FROM contaapagar_despesaprocessoaduaneiro WHERE grupo = 1 AND empresa = 1 AND filial = 1 AND unidade = 1 AND sequencia = 0;

SELECT Cadastro.razaosocial FROM Cadastro WHERE Cadastro.codigo = '98929453015';

SELECT ARRAY_TO_STRING(( SELECT ARRAY(SELECT DISTINCT ' PROC.: '||contaapagar_despesaprocessoaduaneiro.numeroprocessoaduaneiro||' - VALOR: '|| contaapagar_despesaprocessoaduaneiro.valor	 FROM contaapagar_despesaprocessoaduaneiro WHERE grupo = 1 AND empresa = 1 AND filial  = 1 AND unidade = 1 AND sequencia = 0 )),',')::VARCHAR AS processo FROM contaapagar_despesaprocessoaduaneiro WHERE grupo = 1 AND empresa = 1 AND filial  = 1 AND unidade = 1 AND sequencia =  0 LIMIT 1;

SELECT permitirtituloduplicado FROM empresa_parametro WHERE grupo = 1 AND empresa = 1 AND tipodocumento = 2;

SELECT TRUE FROM moeda JOIN unidade ON unidade.pais = moeda.pais WHERE moeda.codigo = 1 AND unidade.grupo = 1 AND unidade.empresa = 1 AND unidade.filial = 1 AND unidade.codigo = 1;

SELECT fnc_sequence('contaapagar',1,1,1,1,NULL,NULL);

INSERT INTO Contaapagar( grupo, empresa, filial, unidade, sequencia, numerotitulo, numeroparcela, usuarioemissor, moeda, reduzido, cnpjcpfcodigo, valortitulomoeda, valortitulo, valormulta, valorjuro, valordesconto, valordespesacartorio, valordespesaprotesto, valorpago, valorpendente, dtemissaotitulo, dtvencimento, dtprevisaopagamento, dtcartorio, dtprotesto, dtpagamento, observacao, composicao, reduzidodebito, tipotitulo, apropriacao, numeroautenticacao, protocoloautenticacao, semaforo) VALUES( 1, 1, 1, 1, 863559, 'RESSARC DESP 12025', 1, 199, 1, 277, '98929453015', 498.2, 498.2, 0, 0, 0, 0, 0, 0, 498.2, '2026-01-06', '2026-01-06', '2026-01-06', NULL, NULL, NULL, '', 3, 366, 4, 1, NULL, NULL, 0) RETURNING sequencia;

INSERT INTO Contaapagar_composicao( grupo, empresa, filial, unidade, sequencia, sequenciacomposicao, tipodocumentoorigem, grupodocumentoorigem, empresadocumentoorigem, filialdocumentoorigem, unidadedocumentoorigem, cnpjcpfcodigodocumentoorigem, dtemissaodocumentoorigem, diferenciadornumerodocumentoorigem, seriedocumentoorigem, numerosequenciadocumentoorigem, numeroparcela, dtInc, dtvencimento, dtprevisaopagamento, cnpjcpfcodigo, reduzido, valortitulo, quantidadeparcela, codigobarra, tipotitulo, linhadigitavel)  VALUES( 1, 1, 1, 1, 863559, 1, 2, 1, 1, 1, 1, '98929453015', '2026-01-06', NULL, NULL, 863559, 1, '2026-01-06', '2026-01-06', '2026-01-06', '98929453015', 277, 498.2, 1, '', 4, '');

INSERT INTO Contaapagar_contabilizacao( grupo, empresa, filial, unidade, sequencia, sequenciacontabilizacao, reduzido, valorcredito, historico, historicodescricao, apropriacao, contabilizar, valorsaldo, cnpjcpfcodigo) VALUES( 1, 1, 1, 1, 863559, 1, 277, 498.2, 130, 'REF. RESSARCIMENTO DE DESPESAS GERAIS  –  CLAUSULA OITAVA CONVENÇÃO SINDIMERCOSUL RESSARC DESP 12025/1  -  ADAIR JOSE DE LIMA TEIXEIRA', 1, 1, 498.2, '98929453015');

INSERT INTO Contaapagar_contabilizacao_filial( grupo, empresa, filial, unidade, sequencia, sequenciacontabilizacao, filialcontabilizado, valorsaldo, valorcredito) VALUES( 1, 1, 1, 1, 863559, 1, 1, 498.2, 498.2);

INSERT INTO Contaapagar_contabilizacao_filial_unidade( grupo, empresa, filial, unidade, sequencia, sequenciacontabilizacao, filialcontabilizado, unidadecontabilizado, valorsaldo, valorcredito) VALUES( 1, 1, 1, 1, 863559, 1, 1, 1, 498.2, 498.2);

SELECT COUNT(grupo) FROM contaapagar_despesaprocessoaduaneiro WHERE grupo = 1 AND empresa = 1 AND filial = 1 AND unidade = 1 AND sequencia = 863559;

SELECT Cadastro.razaosocial FROM Cadastro WHERE Cadastro.codigo = '98929453015';

SELECT ARRAY_TO_STRING(( SELECT ARRAY(SELECT DISTINCT ' PROC.: '||contaapagar_despesaprocessoaduaneiro.numeroprocessoaduaneiro||' - VALOR: '|| contaapagar_despesaprocessoaduaneiro.valor	 FROM contaapagar_despesaprocessoaduaneiro WHERE grupo = 1 AND empresa = 1 AND filial  = 1 AND unidade = 1 AND sequencia = 863559 )),',')::VARCHAR AS processo FROM contaapagar_despesaprocessoaduaneiro WHERE grupo = 1 AND empresa = 1 AND filial  = 1 AND unidade = 1 AND sequencia =  863559 LIMIT 1;

SELECT COALESCE(MAX(sequenciacontabilizacao),0) +1 FROM Contaapagar_contabilizacao WHERE Contaapagar_contabilizacao.grupo = 1 AND Contaapagar_contabilizacao.empresa = 1 AND Contaapagar_contabilizacao.filial = 1 AND Contaapagar_contabilizacao.unidade = 1 AND Contaapagar_contabilizacao.sequencia = 863559;

INSERT INTO Contaapagar_contabilizacao( grupo, empresa, filial, unidade, sequencia, sequenciacontabilizacao, reduzido, valordebito, historico, historicodescricao, apropriacao, contabilizar, valorsaldo, cnpjcpfcodigo, incluidomanualmente) VALUES( 1, 1, 1, 1, 863559, 2, 366, 498.2, 130, 'REF. RESSARCIMENTO DE DESPESAS GERAIS  –  CLAUSULA OITAVA CONVENÇÃO SINDIMERCOSUL RESSARC DESP 12025/1  -  ADAIR JOSE DE LIMA TEIXEIRA', 2, 1, 498.2, '98929453015', 2);

INSERT INTO Contaapagar_contabilizacao_filial( grupo, empresa, filial, unidade, sequencia, sequenciacontabilizacao, filialcontabilizado, valorsaldo, valordebito) VALUES( 1, 1, 1, 1, 863559, 2, 1, 498.2, 498.2);

INSERT INTO Contaapagar_contabilizacao_filial_unidade( grupo, empresa, filial, unidade, sequencia, sequenciacontabilizacao, filialcontabilizado, unidadecontabilizado, valorsaldo, valordebito) VALUES( 1, 1, 1, 1, 863559, 2, 1, 1, 498.2, 498.2);

SELECT Cadastro_vinculo_parametrotipodocumento.grupo FROM Cadastro_vinculo_parametrotipodocumento WHERE Cadastro_vinculo_parametrotipodocumento.grupo = 1 AND Cadastro_vinculo_parametrotipodocumento.empresa = 1 AND Cadastro_vinculo_parametrotipodocumento.cnpjcpfcodigo = '98929453015' AND Cadastro_vinculo_parametrotipodocumento.vinculo = 2 AND Cadastro_vinculo_parametrotipodocumento.tipodocumento = 2;

SELECT TO_CHAR(COALESCE(fnc_define_horariolocal(1,1,1, 1, null, 1, 1, 1),'00:00:00')::TIMESTAMP,'YYYYMMDDHH24MISS');

 UPDATE Contaapagar SET 
numerotitulo = 'RESSARC DESP 12025', numeroparcela = 1, valorpendente = 498.2, valorpago = 0, valortitulo = 498.2, dtprevisaopagamento = '2026-01-06', dtvencimento = '2026-01-06', cnpjcpfcodigo = '98929453015', reduzido = 277, dtpagamento = NULL, dtemissaotitulo = '2026-01-06', dtcartorio = NULL, dtprotesto = NULL, sequencia = 863559, grupo = 1, empresa = 1, filial = 1, unidade = 1, composicao = 3, moeda = 1, valortitulomoeda = 498.2, valormulta = 0, valorjuro = 0, valordesconto = 0, valordespesacartorio = 0, valordespesaprotesto = 0, observacao = NULL, grupodocumentoorigem = NULL, empresadocumentoorigem = NULL, filialdocumentoorigem = NULL, unidadedocumentoorigem = NULL, cnpjcpfcodigodocumentoorigem = NULL, diferenciadornumerodocumentoorigem = NULL, seriedocumentoorigem = NULL, numerosequenciadocumentoorigem = NULL, dtemissaodocumentoorigem = NULL, dtinc = '2026-01-06', codigobarra = NULL, linhadigitavel = NULL, quantidadeparcela = 1, dtalt = '2026-01-06', semaforo = 0, tipopagamento = NULL, tipodocumentoorigem = 0, posicaocnab = 2, nroremessa = NULL, apropriacao = 1, bancocredor = NULL, agenciacredor = NULL, contacredor = NULL, cnpjcpfcodigocredor = NULL, vinculocredor = NULL, formalancamento = NULL, tipotitulo = 4, cnpjcpfcodigoadiantamento = NULL, proprietario = NULL, veiculo = NULL, reduzidodebito = 366, formapagamento = 2, moedapagamentooutramoeda = NULL, dtcambiopagamentooutramoeda = NULL, valorcambiopagamentooutramoeda = 0, valortitulomoedapagamentooutramoeda = 0, informarmanualmentecontrato = 2, codigocobranca = NULL, tipo = 2, valordespesacartoriomoeda = 0, valormultamoeda = 0, valordespesaprotestomoeda = 0, valorjuromoeda = 0, valordescontomoeda = 0, valorpagomoeda = 0, valorpendentemoeda = 498.2, geracreditopiscofins = 2, naturezabasecalculocredito = NULL, indicadororigemcredito = NULL, cstpis = NULL, valorbasecalculopis = 0, percaliquotapis = 0, valorpis = 0, cstcofins = NULL, valorbasecalculocofins = 0, percaliquotacofins = 0, valorcofins = 0, codigoformalancamentointerna = -1, codigodareceitadotributo = NULL, identificadorfgts = NULL, lacreconectividadesocial = NULL, digitolagreconectividadesocial = NULL, valorreceitabrutaacumulada = NULL, percentualsobrereceitabrutaacumulada = 0, codigousuario = 199, valorrecolhimento = 0, outrosvalores = 0, acrescimos = 0, numeroautenticacao = NULL, protocoloautenticacao = NULL, cnpjcpfcodigosacadoravalista = NULL
 WHERE Contaapagar.grupo = 1 AND Contaapagar.empresa = 1 AND Contaapagar.filial = 1 AND Contaapagar.unidade = 1 AND Contaapagar.sequencia = 863559;

SELECT Fnc_trocasemaforo_contaapagar( 1, 1, 1, 1, 863559, 1, 199, 1);

UPDATE contaapagar SET usuarioalteracao = 199 WHERE grupo = 1 AND empresa = 1 AND filial = 1 AND unidade = 1 AND sequencia = 0;

SELECT fnc_enviaremail_gestaofinanceiro (2 ,1 ,1 ,1 ,1 ,863559 ,NULL ,NULL ,NULL ,NULL ,NULL ,1 ,NULL ,199 ,1);

SELECT acertoviagemagregado.liberaracertoagregadocontaapagar FROM acertoviagemagregado JOIN contaapagar_composicao on contaapagar_composicao.grupodocumentoorigem = acertoviagemagregado.grupo AND contaapagar_composicao.empresadocumentoorigem = acertoviagemagregado.empresa AND contaapagar_composicao.filialdocumentoorigem = acertoviagemagregado.filial AND contaapagar_composicao.unidadedocumentoorigem = acertoviagemagregado.unidade AND contaapagar_composicao.diferenciadornumerodocumentoorigem = acertoviagemagregado.diferenciadornumero AND contaapagar_composicao.numerosequenciadocumentoorigem = acertoviagemagregado.numero AND contaapagar_composicao.tipodocumentoorigem = 4 WHERE contaapagar_composicao.grupo = 1 AND contaapagar_composicao.empresa = 1 AND contaapagar_composicao.filial = 1 AND contaapagar_composicao.unidade = 1 AND contaapagar_composicao.sequencia = 863559;

SELECT controlaralteracaodelecao FROM empresa_parametro WHERE grupo = 1 AND empresa = 1 AND tipodocumento = 2;



