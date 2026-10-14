import { api } from '@/lib/social';
import { usePaginatedQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, type ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatScreen, type ChatMessage } from './chat-screen';
import { FeedIcon } from './feed-icon';
import { Avatar } from './social/media';
import { inboxTime, NewConversation } from './social/messages';
import { ConnectionStatus, LoadMore } from './social/ui';

export function MessagesTab({ preview = false }: { preview?: boolean }) {
  return preview ? <MessagesLayout /> : <LiveInbox />;
}
function LiveInbox() {
  const [unread, setUnread] = useState(false);
  const rows = usePaginatedQuery(api.messaging.list, { unreadOnly: unread }, { initialNumItems: 20 }); const router = useRouter();
  return <MessagesLayout onFilter={setUnread} liveRows={rows.results.map(item => <ConversationRow key={item._id} name={item.other.username} text={item.preview} time={inboxTime(item.lastMessageAt)} unread={item.unread} avatar={size => <Avatar profile={item.other} size={size} />} onPress={() => router.push({ pathname: '/chat/[id]', params: { id: item._id } })} />)} footer={<LoadMore status={rows.status} loadMore={rows.loadMore} />} status={<ConnectionStatus />} />;
}
function MessagesLayout({ onFilter, liveRows, footer, status }: { onFilter?: (unread: boolean) => void; liveRows?: ReactNode[]; footer?: ReactNode; status?: ReactNode }) {
  const [filter, setFilter] = useState('All'); const [selected, setSelected] = useState<number | null>(null); const [newChat, setNewChat] = useState(false);
  const [threads, setThreads] = useState<ChatMessage[][]>([]);
  const [read, setRead] = useState<number[]>([]); const insets = useSafeAreaInsets(); const { width, height } = useWindowDimensions(); const s = width / 390; const vertical = Math.max(1, Math.min(1.12, height / width / (1502 / 739)));
  return <View style={[styles.screen, { paddingTop: insets.top, marginBottom: 85 }]}><StatusBar style="dark" />
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 19 * s, paddingTop: 19 * s * vertical, paddingBottom: 24 * s * vertical }}><Text accessibilityRole="header" style={[styles.heading, { fontSize: 33 * s }]}>Messages</Text><Pressable accessibilityRole="button" accessibilityLabel="New message" onPress={() => setNewChat(true)} hitSlop={12}><FeedIcon name="compose" size={27 * s} color="#087EFF" /></Pressable></View>
    <View style={{ flexDirection: 'row', gap: 6 * s, paddingHorizontal: 18 * s, paddingBottom: 20 * s * vertical }}>{['All', 'Unread', 'Groups'].map(label => <Pressable key={label} accessibilityRole="button" accessibilityState={{ selected: filter === label }} onPress={() => { setFilter(label); onFilter?.(label === 'Unread'); }} style={{ backgroundColor: filter === label ? '#087EFF' : '#F3F5FA', borderRadius: 24 * s, width: (label === 'All' ? 70 : 95) * s, height: 37 * s * vertical, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 15 * s, color: filter === label ? 'white' : '#123969', letterSpacing: -0.4 }}>{label}</Text></Pressable>)}</View>
    {status}<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 18 * s, paddingBottom: 100 }}>
      {filter === 'Groups' ? <View style={{ padding: 30, alignItems: 'center', gap: 10 }}><FeedIcon name="comment" size={32} color="#8A90A7" /><Text style={styles.name}>Group messaging</Text><Text style={[styles.preview, { textAlign: 'center' }]}>For now, start a private conversation with one member.</Text></View> : <>
        {liveRows}{footer}
        {!liveRows?.length && <View style={styles.emptyState}><FeedIcon name="comment" size={48} color="#8A90A7" /><Text style={styles.emptyText}>No messages yet.</Text><Text style={styles.emptySubtext}>Start a conversation to connect with people.</Text></View>}
        {filter === 'Unread' && !liveRows?.length && <Text style={[styles.preview, { padding: 24, textAlign: 'center' }]}>You're all caught up.</Text>}
      </>}
    </ScrollView>
    <Modal visible={selected !== null} animationType="slide" presentationStyle="fullScreen" onRequestClose={() => setSelected(null)}>{selected !== null && <ChatScreen messages={threads[selected]} setMessages={update => setThreads(current => current.map((thread, i) => i === selected ? typeof update === 'function' ? update(thread) : update : thread))} onBack={() => setSelected(null)} peer={selected ? { name: 'User', avatar: size => <FeedIcon name="profile" size={size} color="#8A90A7" /> } : undefined} />}</Modal>
    <Modal visible={newChat} animationType="slide" presentationStyle="fullScreen" onRequestClose={() => setNewChat(false)}>{onFilter ? <NewConversation close={() => setNewChat(false)} /> : <View style={{ padding: 50 }}><Text>Sign in to start a private conversation.</Text><Pressable onPress={() => setNewChat(false)}><Text>Close</Text></Pressable></View>}</Modal>
  </View>;
}
function ConversationRow({ name, text, time, unread, online, avatar, onPress }: { name: string; text: string; time: string; unread?: boolean; online?: boolean; avatar: (size: number) => ReactNode; onPress: () => void }) {
  const { width, height } = useWindowDimensions(); const s = width / 390; const vertical = Math.max(1, Math.min(1.12, height / width / (1502 / 739)));
  return <Pressable accessibilityRole="button" accessibilityLabel={`Open chat with ${name}${unread ? ', unread' : ''}`} onPress={onPress} style={{ backgroundColor: '#F3F5FA', borderRadius: 18 * s, padding: 9 * s, height: 80 * s * vertical, marginBottom: 10 * s * vertical, flexDirection: 'row', alignItems: 'center', gap: 19 * s }}>
    <View>{avatar(60 * s)}{online && <View style={{ position: 'absolute', right: 0, bottom: 0, width: 17 * s, height: 17 * s, borderRadius: 9 * s, backgroundColor: '#08CC47', borderWidth: 2 * s, borderColor: 'white' }} />}</View>
    <View style={{ flex: 1, gap: 5 * s }}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><Text numberOfLines={1} style={[styles.name, { flex: 1, fontSize: 18 * s }]}>{name}</Text><Text style={{ color: '#8491B1', fontSize: 13 * s, marginRight: 9 * s, letterSpacing: -0.4 }}>{time}</Text></View><View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 * s }}><Text numberOfLines={1} style={[styles.preview, { flex: 1, fontSize: 15 * s }]}>{text}</Text>{unread && <View style={{ width: 11 * s, height: 11 * s, borderRadius: 6 * s, backgroundColor: '#087EFF' }} />}<View style={{ transform: [{ rotate: '180deg' }], marginRight: 3 * s }}><FeedIcon name="back" size={16 * s} color="#8491B1" /></View></View></View>
  </Pressable>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#FCFDFE' }, heading: { fontWeight: '700', color: '#0C112D', letterSpacing: -1.2 }, name: { fontSize: 18, fontWeight: '700', color: '#0C112D', letterSpacing: -0.6 }, preview: { fontSize: 15, color: '#8491B1', letterSpacing: -0.5 }, emptyState: { alignItems: 'center', paddingVertical: 40, gap: 12 }, emptyText: { fontSize: 18, fontWeight: '600', color: '#0C112D' }, emptySubtext: { fontSize: 15, color: '#8491B1', textAlign: 'center', paddingHorizontal: 40 } });
