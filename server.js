const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const { parse } = require('csv-parse');
const XLSX = require('xlsx');
const cors = require('cors');
const { Readable } = require('stream');
const path = require('path');
const os = require('os');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});

const upload = multer();


const GRUPO = 1, EMPRESA = 1, FILIAL = 1, UNIDADE = 1;
const USUARIO_ID = 199;
const MOEDA_ID = 1;
const REDUZIDO_CREDITO = 277;
const REDUZIDO_DEBITO = 366;
const HISTORICO_ID = 130;
const TIPODOC_ORIGEM = 2;
const TIPO_TITULO = 4;
const FORMA_PAGAMENTO = 2;

function getDiasMesAnterior() {
    const hoje = new Date();
    const dataMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
    return {
        totalDias: dataMesAnterior.getDate(),
        mes: dataMesAnterior.getMonth() + 1,
        ano: dataMesAnterior.getFullYear()
    };
}


app.post('/api/consultar-motoristas', async (req, res) => {
    const { nomes } = req.body;

    if (!nomes || !Array.isArray(nomes)) {
        return res.status(400).json({ error: 'Lista de nomes inválida.' });
    }

    const client = await pool.connect();
    try {
        const resultados = [];

        for (const nome of nomes) {
      
            const resQuery = await client.query("SELECT codigo FROM cadastro WHERE razaosocial = $1 LIMIT 1", [nome]);

            if (resQuery.rows.length > 0) {
                resultados.push({
                    nome: nome,
                    cpf: resQuery.rows[0].codigo,
                    encontrado: true
                });
            } else {
                resultados.push({
                    nome: nome,
                    cpf: null,
                    encontrado: false
                });
            }
        }

        res.json({ resultados });
    } catch (err) {
        console.error('Erro ao consultar motoristas:', err);
        res.status(500).json({ error: 'Erro ao consultar banco de dados.' });
    } finally {
        client.release();
    }
});

app.post('/api/importar', upload.single('file'), async (req, res) => {
    const { valorBase, tituloId, previewData } = req.body;
    const file = req.file;

    if (!tituloId) {
        return res.status(400).json({ error: 'Faltam dados obrigatórios.' });
    }

    const { totalDias, mes, ano } = getDiasMesAnterior();
    const dataHoje = new Date().toISOString().split('T')[0];
    let records = [];

    try {
     
        if (previewData) {
            const parsedPreview = JSON.parse(previewData);
            records = parsedPreview.map(item => ({
                NOME: item.nome,
                Dias: item.dias,
                valorEditado: item.valor //valor editavel pelo usuario
            }));
        } else if (file) {
      
            const fileName = file.originalname.toLowerCase();
            const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');

            if (isExcel) {
                const workbook = XLSX.read(file.buffer, { type: 'buffer' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                records = XLSX.utils.sheet_to_json(worksheet);
            } else {
                const parser = Readable.from(file.buffer).pipe(parse({
                    columns: true,
                    delimiter: [';', ','],
                    skip_empty_lines: true,
                    trim: true,
                    bom: true
                }));

                for await (const row of parser) {
                    records.push(row);
                }
            }
        } else {
            return res.status(400).json({ error: 'Nenhum arquivo ou dados fornecidos.' });
        }

        const client = await pool.connect();
        const resultados = [];

        try {
            await client.query('BEGIN');

            for (const record of records) {
                const nomeMotorista = record.NOME;
                const diasTrabalhados = parseInt(record.Dias);

                if (isNaN(diasTrabalhados)) continue;

 
                const valorCalculado = record.valorEditado !== undefined
                    ? parseFloat(record.valorEditado)
                    : parseFloat(((parseFloat(valorBase) / totalDias) * diasTrabalhados).toFixed(2));


                const resM = await client.query("SELECT codigo FROM cadastro WHERE razaosocial = $1 LIMIT 1", [nomeMotorista]);
                if (resM.rows.length === 0) {
                    resultados.push({ nome: nomeMotorista || 'Nome Desconhecido', status: 'Erro: Motorista não encontrado no cadastro', semSucesso: true });
                    continue;
                }
                const v_fornecedor = resM.rows[0].codigo;


                const resSeq = await client.query("SELECT fnc_sequence('contaapagar', $1, $2, $3, $4, NULL, NULL)", [GRUPO, EMPRESA, FILIAL, UNIDADE]);
                const v_sequencia = resSeq.rows[0].fnc_sequence;

                const v_num_titulo = tituloId;
                const v_historico = `REF. RESSARCIMENTO DESPESAS - ${nomeMotorista} - ${mes.toString().padStart(2, '0')}/${ano}`;


                await client.query(`
                    INSERT INTO Contaapagar (
                        grupo, empresa, filial, unidade, sequencia, numerotitulo, numeroparcela, 
                        usuarioemissor, moeda, reduzido, reduzidodebito, cnpjcpfcodigo, valortitulo, 
                        valortitulomoeda, valorpendente, dtemissaotitulo, dtvencimento, dtprevisaopagamento, 
                        composicao, tipotitulo, semaforo, formapagamento, dtinc, apropriacao
                    ) VALUES ($1, $2, $3, $4, $5, $6, 1, $7, $8, $9, $10, $11, $12, $12, $12, $13, $13, $13, 3, $14, 0, $15, $13, 1)
                `, [GRUPO, EMPRESA, FILIAL, UNIDADE, v_sequencia, v_num_titulo, USUARIO_ID, MOEDA_ID, REDUZIDO_CREDITO, REDUZIDO_DEBITO, v_fornecedor, valorCalculado, dataHoje, TIPO_TITULO, FORMA_PAGAMENTO]);


                await client.query(`
                    INSERT INTO Contaapagar_composicao (
                        grupo, empresa, filial, unidade, sequencia, sequenciacomposicao, 
                        tipodocumentoorigem, dtemissaodocumentoorigem, numerosequenciadocumentoorigem, 
                        cnpjcpfcodigo, reduzido, valortitulo, tipotitulo, dtinc,
                        grupodocumentoorigem, empresadocumentoorigem, filialdocumentoorigem, 
                        unidadedocumentoorigem, cnpjcpfcodigodocumentoorigem, numeroparcela, 
                        dtvencimento, dtprevisaopagamento, quantidadeparcela
                    ) VALUES ($1, $2, $3, $4, $5, 1, $6, $7, $5, $8, $9, $10, $11, $7, $1, $2, $3, $4, $8, 1, $7, $7, 1)
                `, [GRUPO, EMPRESA, FILIAL, UNIDADE, v_sequencia, TIPODOC_ORIGEM, dataHoje, v_fornecedor, REDUZIDO_CREDITO, valorCalculado, TIPO_TITULO]);


                await client.query(`
                    INSERT INTO Contaapagar_contabilizacao (
                        grupo, empresa, filial, unidade, sequencia, sequenciacontabilizacao, 
                        reduzido, valorcredito, historico, historicodescricao, apropriacao, contabilizar, valorsaldo, cnpjcpfcodigo
                    ) VALUES ($1, $2, $3, $4, $5, 1, $6, $7, $8, $9, 1, 1, $7, $10)
                `, [GRUPO, EMPRESA, FILIAL, UNIDADE, v_sequencia, REDUZIDO_CREDITO, valorCalculado, HISTORICO_ID, v_historico, v_fornecedor]);

                await client.query("INSERT INTO Contaapagar_contabilizacao_filial (grupo, empresa, filial, unidade, sequencia, sequenciacontabilizacao, filialcontabilizado, valorsaldo, valorcredito) VALUES ($1, $2, $3, $4, $5, 1, $6, $7, $7)", [GRUPO, EMPRESA, FILIAL, UNIDADE, v_sequencia, FILIAL, valorCalculado]);
                await client.query("INSERT INTO Contaapagar_contabilizacao_filial_unidade (grupo, empresa, filial, unidade, sequencia, sequenciacontabilizacao, filialcontabilizado, unidadecontabilizado, valorsaldo, valorcredito) VALUES ($1, $2, $3, $4, $5, 1, $6, $7, $8, $8)", [GRUPO, EMPRESA, FILIAL, UNIDADE, v_sequencia, FILIAL, UNIDADE, valorCalculado]);


                await client.query(`
                    INSERT INTO Contaapagar_contabilizacao (
                        grupo, empresa, filial, unidade, sequencia, sequenciacontabilizacao, 
                        reduzido, valordebito, historico, historicodescricao, apropriacao, contabilizar, valorsaldo, cnpjcpfcodigo, incluidomanualmente
                    ) VALUES ($1, $2, $3, $4, $5, 2, $6, $7, $8, $9, 2, 1, $7, $10, 2)
                `, [GRUPO, EMPRESA, FILIAL, UNIDADE, v_sequencia, REDUZIDO_DEBITO, valorCalculado, HISTORICO_ID, v_historico, v_fornecedor]);

                await client.query("INSERT INTO Contaapagar_contabilizacao_filial (grupo, empresa, filial, unidade, sequencia, sequenciacontabilizacao, filialcontabilizado, valorsaldo, valordebito) VALUES ($1, $2, $3, $4, $5, 2, $6, $7, $7)", [GRUPO, EMPRESA, FILIAL, UNIDADE, v_sequencia, FILIAL, valorCalculado]);
                await client.query("INSERT INTO Contaapagar_contabilizacao_filial_unidade (grupo, empresa, filial, unidade, sequencia, sequenciacontabilizacao, filialcontabilizado, unidadecontabilizado, valorsaldo, valordebito) VALUES ($1, $2, $3, $4, $5, 2, $6, $7, $8, $8)", [GRUPO, EMPRESA, FILIAL, UNIDADE, v_sequencia, FILIAL, UNIDADE, valorCalculado]);

                await client.query("SELECT Fnc_trocasemaforo_contaapagar($1, $2, $3, $4, $5, 1, $6, 1)", [GRUPO, EMPRESA, FILIAL, UNIDADE, v_sequencia, USUARIO_ID]);

                await client.query("UPDATE contaapagar SET usuarioalteracao = $6 WHERE grupo = $1 AND empresa = $2 AND filial = $3 AND unidade = $4 AND sequencia = $5", [GRUPO, EMPRESA, FILIAL, UNIDADE, v_sequencia, USUARIO_ID]);

                await client.query("SELECT fnc_enviaremail_gestaofinanceiro (2, $1, $2, $3, $4, $5, NULL, NULL, NULL, NULL, NULL, 1, NULL, $6, 1)", [GRUPO, EMPRESA, FILIAL, UNIDADE, v_sequencia, USUARIO_ID]);

                await client.query(`
                    SELECT acertoviagemagregado.liberaracertoagregadocontaapagar 
                    FROM acertoviagemagregado 
                    JOIN contaapagar_composicao on contaapagar_composicao.grupodocumentoorigem = acertoviagemagregado.grupo 
                        AND contaapagar_composicao.empresadocumentoorigem = acertoviagemagregado.empresa 
                        AND contaapagar_composicao.filialdocumentoorigem = acertoviagemagregado.filial 
                        AND contaapagar_composicao.unidadedocumentoorigem = acertoviagemagregado.unidade 
                        AND contaapagar_composicao.diferenciadornumerodocumentoorigem = acertoviagemagregado.diferenciadornumero 
                        AND contaapagar_composicao.numerosequenciadocumentoorigem = acertoviagemagregado.numero 
                        AND contaapagar_composicao.tipodocumentoorigem = 4 
                    WHERE contaapagar_composicao.grupo = $1 
                        AND contaapagar_composicao.empresa = $2 
                        AND contaapagar_composicao.filial = $3 
                        AND contaapagar_composicao.unidade = $4 
                        AND contaapagar_composicao.sequencia = $5
                `, [GRUPO, EMPRESA, FILIAL, UNIDADE, v_sequencia]);

                await client.query("SELECT controlaralteracaodelecao FROM empresa_parametro WHERE grupo = $1 AND empresa = $2 AND tipodocumento = 2", [GRUPO, EMPRESA]);

                resultados.push({ nome: nomeMotorista, status: 'Sucesso', seq: v_sequencia, valor: valorCalculado });
            }

            await client.query('COMMIT');

            const totalErros = resultados.filter(r => r.semSucesso).length;
            const message = totalErros > 0 ? 'Processamento concluído com alertas.' : 'Processamento concluído com sucesso total.';

            res.json({ message, resultados, totalErros });
        } catch (err) {
            await client.query('ROLLBACK');
            res.status(500).json({ error: err.message });
        } finally {
            client.release();
        }
    } catch (err) {
        res.status(500).json({ error: 'Erro ao processar CSV: ' + err.message });
    }
});

const PORT = 3001;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    const addresses = [];
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4') {
                addresses.push(`http://${iface.address}:${PORT}`);
            }
        }
    }
    console.log(`Servidor rodando!`);
    console.log(`Acesse localmente em: http://localhost:${PORT}`);
    console.log(`Acesse na rede em:`);
    addresses.forEach(addr => console.log(`  - ${addr}`));
});