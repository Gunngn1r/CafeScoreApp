import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { adicionarCafe, initDatabase, obterCafes, removerCafe, type Cafe } from './service/database';

export default function App() {
  const [nome, setNome] = useState('');
  const [nota, setNota] = useState('5');
  const [listaCafes, setListaCafes] = useState<Cafe[]>([]);
  const [mensagem, setMensagem] = useState('');

  const carregarDados = () => setListaCafes(obterCafes());

  useEffect(() => {
    try {
      initDatabase();
      carregarDados();
    } catch {
      setMensagem('Não foi possível inicializar o banco de dados.');
    }
  }, []);

  const handleSalvar = () => {
    const notaNumerica = Number.parseInt(nota, 10);
    if (!nome.trim()) {
      setMensagem('Digite o nome do café antes de salvar.');
      return;
    }
    if (Number.isNaN(notaNumerica) || notaNumerica < 1 || notaNumerica > 5) {
      setMensagem('A nota deve ser um número entre 1 e 5.');
      return;
    }
    try {
      adicionarCafe(nome.trim(), notaNumerica);
      setNome('');
      carregarDados();
      setMensagem('Degustação salva com sucesso.');
    } catch {
      setMensagem('Não foi possível salvar a degustação.');
    }
  };

  const handleExcluir = (id: number) => {
    try {
      removerCafe(id);
      carregarDados();
      setMensagem('Degustação removida.');
    } catch {
      setMensagem('Não foi possível remover a degustação.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.hero}>
        <Text style={styles.kicker}>DIÁRIO DE DEGUSTAÇÃO</Text>
        <Text style={styles.titulo}>CafeScore</Text>
        <Text style={styles.subtitulo}>Registre o sabor de cada descoberta.</Text>
      </View>
      <View style={styles.formulario}>
        <Text style={styles.label}>Nome do café</Text>
        <TextInput style={styles.input} placeholder="Ex.: Espresso Arábica" placeholderTextColor="#8e8a80" value={nome} onChangeText={setNome} />
        <Text style={styles.label}>Nota de 1 a 5</Text>
        <TextInput style={styles.input} keyboardType="number-pad" maxLength={1} value={nota} onChangeText={setNota} />
        <Pressable style={styles.botao} onPress={handleSalvar}>
          <Text style={styles.textoBotao}>Salvar degustação</Text>
        </Pressable>
        {!!mensagem && <Text style={styles.mensagem}>{mensagem}</Text>}
      </View>
      <View style={styles.listaCabecalho}>
        <Text style={styles.listaTitulo}>Suas degustações</Text>
        <Text style={styles.contador}>{listaCafes.length}</Text>
      </View>
      <FlatList
        contentContainerStyle={styles.lista}
        data={listaCafes}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum café registrado ainda.</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemTexto}>
              <Text style={styles.nomeCafe}>{item.nome}</Text>
              <Text style={styles.dataCafe}>{item.data}</Text>
            </View>
            <View style={styles.itemAcao}>
              <Text style={styles.notaCafe}>{item.nota}/5</Text>
              <Pressable onPress={() => handleExcluir(item.id)}><Text style={styles.excluir}>Excluir</Text></Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f1e8',
    paddingTop: 48,
  },
  hero: { backgroundColor: '#23352b', paddingHorizontal: 24, paddingVertical: 28 },
  kicker: { color: '#d6a756', fontSize: 12, fontWeight: '700', letterSpacing: 1.5 },
  titulo: { color: '#fffaf0', fontSize: 40, fontWeight: '800', marginTop: 8 },
  subtitulo: { color: '#d9e0d5', fontSize: 15, marginTop: 4 },
  formulario: { padding: 24 },
  label: { color: '#4f544a', fontSize: 12, fontWeight: '700', marginBottom: 7, textTransform: 'uppercase' },
  input: { backgroundColor: '#fffaf0', borderColor: '#ded7c8', borderRadius: 8, borderWidth: 1, color: '#23352b', fontSize: 16, marginBottom: 16, padding: 13 },
  botao: { alignItems: 'center', backgroundColor: '#c56b3e', borderRadius: 8, padding: 15 },
  textoBotao: { color: '#fffaf0', fontSize: 15, fontWeight: '800' },
  mensagem: { color: '#6b5132', fontSize: 14, marginTop: 12 },
  listaCabecalho: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24 },
  listaTitulo: { color: '#23352b', fontSize: 20, fontWeight: '800' },
  contador: { color: '#c56b3e', fontSize: 18, fontWeight: '800' },
  lista: { gap: 10, padding: 24, paddingTop: 14 },
  item: { alignItems: 'center', backgroundColor: '#fffaf0', borderLeftColor: '#d6a756', borderLeftWidth: 4, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  itemTexto: { flex: 1 },
  nomeCafe: { color: '#23352b', fontSize: 16, fontWeight: '700' },
  dataCafe: { color: '#8e8a80', fontSize: 12, marginTop: 5 },
  itemAcao: { alignItems: 'flex-end', gap: 6 },
  notaCafe: { color: '#c56b3e', fontSize: 17, fontWeight: '800' },
  excluir: { color: '#8e4c3d', fontSize: 12, fontWeight: '700' },
  vazio: { color: '#8e8a80', fontSize: 14, paddingTop: 12 },
});
