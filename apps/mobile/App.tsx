import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';

type Item = {
  id: string;
  title: string;
  channel: 'linkedin' | 'medium';
};

const API_URL = 'http://localhost:3000';

export default function App() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/content`)
      .then((res) => res.json())
      .then((data: Item[]) => setItems(data))
      .catch(() => setItems([]));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: '#0f172a' }}>PediaCare Mobile</Text>
        <Text style={{ marginTop: 6, color: '#334155' }}>Conteudos do backend para LinkedIn e Medium</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 14,
              padding: 14,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: '#e2e8f0',
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: '600', color: '#0f172a' }}>{item.title}</Text>
            <Text style={{ marginTop: 4, color: '#475569' }}>{item.channel.toUpperCase()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#64748b' }}>Nenhum conteudo encontrado.</Text>}
      />
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}
