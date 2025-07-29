// src/screens/AdminPanelScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView,
  Alert 
} from 'react-native';
import { 
  Text, 
  Card, 
  Button, 
  Searchbar,
  List,
  Badge,
  ActivityIndicator,
  Snackbar,
  Dialog,
  Portal,
  TextInput,
  Chip,
  FAB
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { 
  collection, 
  query, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc,
  orderBy,
  limit,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';

const AdminPanelScreen = () => {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Data states
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalLogs: 0,
    totalPhotos: 0
  });
  const [users, setUsers] = useState([]);
  const [dailyContent, setDailyContent] = useState([]);
  
  // Dialog states
  const [showContentDialog, setShowContentDialog] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [contentForm, setContentForm] = useState({
    day: '',
    motivation: '',
    task: '',
    isPhotoDay: false,
    category: 'routine'
  });
  
  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);
  
  if (!isAdmin) {
    return (
      <View style={styles.noAccessContainer}>
        <Ionicons name="shield-checkmark-outline" size={64} color="#ef4444" />
        <Text style={styles.noAccessTitle}>Přístup odepřen</Text>
        <Text style={styles.noAccessText}>
          Tato sekce je dostupná pouze pro administrátory
        </Text>
      </View>
    );
  }
  
  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Načtení statistik
      await Promise.all([
        loadStats(),
        loadUsers(),
        loadDailyContent()
      ]);
    } catch (error) {
      console.error('Chyba při načítání admin dat:', error);
      setError('Chyba při načítání dat');
    } finally {
      setLoading(false);
    }
  };
  
  const loadStats = async () => {
    try {
      // Počet uživatelů
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const totalUsers = usersSnapshot.size;
      
      // Aktivní uživatelé (přihlášení za posledních 7 dnů)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const activeUsersQuery = query(
        collection(db, 'users'),
        where('lastLoginAt', '>=', weekAgo)
      );
      const activeUsersSnapshot = await getDocs(activeUsersQuery);
      const activeUsers = activeUsersSnapshot.size;
      
      // Celkový počet logů
      const logsSnapshot = await getDocs(collection(db, 'userLogs'));
      const totalLogs = logsSnapshot.size;
      
      // Počet fotek (aproximace)
      let totalPhotos = 0;
      logsSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.photos) {
          totalPhotos += data.photos.length;
        }
      });
      
      setStats({
        totalUsers,
        activeUsers,
        totalLogs,
        totalPhotos
      });
    } catch (error) {
      console.error('Chyba při načítání statistik:', error);
    }
  };
  
  const loadUsers = async () => {
    try {
      const usersQuery = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const usersSnapshot = await getDocs(usersQuery);
      
      const usersData = [];
      usersSnapshot.forEach(doc => {
        usersData.push({ id: doc.id, ...doc.data() });
      });
      
      setUsers(usersData);
    } catch (error) {
      console.error('Chyba při načítání uživatelů:', error);
    }
  };
  
  const loadDailyContent = async () => {
    try {
      const contentQuery = query(
        collection(db, 'dailyContent'),
        orderBy('day', 'asc'),
        limit(20)
      );
      const contentSnapshot = await getDocs(contentQuery);
      
      const contentData = [];
      contentSnapshot.forEach(doc => {
        contentData.push({ id: doc.id, ...doc.data() });
      });
      
      setDailyContent(contentData);
    } catch (error) {
      console.error('Chyba při načítání obsahu:', error);
    }
  };
  
  const saveDailyContent = async () => {
    try {
      if (!contentForm.day || !contentForm.motivation || !contentForm.task) {
        setError('Vyplňte všechna povinná pole');
        return;
      }
      
      const contentData = {
        ...contentForm,
        day: parseInt(contentForm.day),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(doc(db, 'dailyContent', contentForm.day), contentData);
      
      setSuccess('Obsah byl úspěšně uložen');
      setShowContentDialog(false);
      setContentForm({
        day: '',
        motivation: '',
        task: '',
        isPhotoDay: false,
        category: 'routine'
      });
      setEditingContent(null);
      
      await loadDailyContent();
    } catch (error) {
      console.error('Chyba při ukládání obsahu:', error);
      setError('Chyba při ukládání obsahu');
    }
  };
  
  const editContent = (content) => {
    setEditingContent(content);
    setContentForm({
      day: content.day.toString(),
      motivation: content.motivation,
      task: content.task,
      isPhotoDay: content.isPhotoDay || false,
      category: content.category || 'routine'
    });
    setShowContentDialog(true);
  };
  
  const deleteContent = async (day) => {
    Alert.alert(
      'Smazat obsah',
      `Opravdu chcete smazat obsah pro den ${day}?`,
      [
        { text: 'Zrušit', style: 'cancel' },
        {
          text: 'Smazat',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'dailyContent', day.toString()));
              setSuccess('Obsah byl smazán');
              await loadDailyContent();
            } catch (error) {
              setError('Chyba při mazání obsahu');
            }
          }
        }
      ]
    );
  };
  
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const renderDashboard = () => (
    <View>
      {/* Statistiky */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Přehled</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="people" size={32} color="#ec4899" />
              <Text style={styles.statValue}>{stats.totalUsers}</Text>
              <Text style={styles.statLabel}>Celkem uživatelů</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="pulse" size={32} color="#10b981" />
              <Text style={styles.statValue}>{stats.activeUsers}</Text>
              <Text style={styles.statLabel}>Aktivních (7 dnů)</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="document-text" size={32} color="#3b82f6" />
              <Text style={styles.statValue}>{stats.totalLogs}</Text>
              <Text style={styles.statLabel}>Celkem záznamů</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="camera" size={32} color="#f59e0b" />
              <Text style={styles.statValue}>{stats.totalPhotos}</Text>
              <Text style={styles.statLabel}>Celkem fotek</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
      
      {/* Rychlé akce */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Rychlé akce</Text>
          
          <View style={styles.quickActions}>
            <Button
              mode="contained"
              onPress={() => setActiveTab('content')}
              style={[styles.actionButton, { backgroundColor: '#ec4899' }]}
              icon="create"
            >
              Upravit obsah
            </Button>
            
            <Button
              mode="contained"
              onPress={() => setActiveTab('users')}
              style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
              icon="people"
            >
              Správa uživatelů
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
  
  const renderUsers = () => (
    <View>
      <Searchbar
        placeholder="Hledat uživatele..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Uživatelé ({filteredUsers.length})</Text>
          
          {filteredUsers.map((user) => (
            <List.Item
              key={user.id}
              title={user.name || 'Bez jména'}
              description={user.email}
              left={(props) => (
                <List.Icon 
                  {...props} 
                  icon="account" 
                  color={user.isAdmin ? '#ec4899' : '#64748b'} 
                />
              )}
              right={() => (
                <View style={styles.userBadges}>
                  {user.isAdmin && (
                    <Badge style={styles.adminBadge}>Admin</Badge>
                  )}
                  <Badge style={styles.dayBadge}>
                    Den {user.currentDay || 1}
                  </Badge>
                </View>
              )}
              onPress={() => {
                Alert.alert(
                  'Informace o uživateli',
                  `Email: ${user.email}\nVěk: ${user.age || 'N/A'}\nTyp pleti: ${user.skinType || 'N/A'}\nRegistrace: ${user.registrationDate ? new Date(user.registrationDate).toLocaleDateString('cs-CZ') : 'N/A'}`
                );
              }}
            />
          ))}
          
          {filteredUsers.length === 0 && (
            <Text style={styles.emptyText}>Žádní uživatelé nenalezeni</Text>
          )}
        </Card.Content>
      </Card>
    </View>
  );
  
  const renderContent = () => (
    <View>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.contentHeader}>
            <Text style={styles.cardTitle}>Denní obsah</Text>
            <Button
              mode="contained"
              onPress={() => {
                setEditingContent(null);
                setContentForm({
                  day: '',
                  motivation: '',
                  task: '',
                  isPhotoDay: false,
                  category: 'routine'
                });
                setShowContentDialog(true);
              }}
              style={styles.addButton}
              icon="plus"
            >
              Přidat
            </Button>
          </View>
          
          {dailyContent.map((content) => (
            <List.Item
              key={content.id}
              title={`Den ${content.day}`}
              description={content.motivation.substring(0, 50) + '...'}
              left={(props) => (
                <List.Icon 
                  {...props} 
                  icon={content.isPhotoDay ? "camera" : "calendar"} 
                  color={content.isPhotoDay ? "#f59e0b" : "#64748b"} 
                />
              )}
              right={() => (
                <View style={styles.contentActions}>
                  {content.isPhotoDay && (
                    <Chip mode="outlined" compact>FOTO</Chip>
                  )}
                  <Button
                    mode="outlined"
                    compact
                    onPress={() => editContent(content)}
                    style={styles.editButton}
                  >
                    Upravit
                  </Button>
                </View>
              )}
              onPress={() => editContent(content)}
            />
          ))}
          
          {dailyContent.length === 0 && (
            <Text style={styles.emptyText}>Žádný obsah nenalezen</Text>
          )}
        </Card.Content>
      </Card>
    </View>
  );
  
  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <Button
        mode={activeTab === 'dashboard' ? 'contained' : 'outlined'}
        onPress={() => setActiveTab('dashboard')}
        style={styles.tabButton}
        compact
      >
        Dashboard
      </Button>
      <Button
        mode={activeTab === 'users' ? 'contained' : 'outlined'}
        onPress={() => setActiveTab('users')}
        style={styles.tabButton}
        compact
      >
        Uživatelé
      </Button>
      <Button
        mode={activeTab === 'content' ? 'contained' : 'outlined'}
        onPress={() => setActiveTab('content')}
        style={styles.tabButton}
        compact
      >
        Obsah
      </Button>
    </View>
  );
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} color="#ec4899" size="large" />
        <Text style={styles.loadingText}>Načítám admin panel...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="shield-checkmark" size={28} color="#ec4899" />
          <Text style={styles.title}>Admin Panel</Text>
        </View>
        <Button
          mode="outlined"
          onPress={loadAdminData}
          style={styles.refreshButton}
          icon="refresh"
          compact
        >
          Obnovit
        </Button>
      </View>
      
      {/* Tab Bar */}
      {renderTabBar()}
      
      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'content' && renderContent()}
      </ScrollView>
      
      {/* Content Editor Dialog */}
      <Portal>
        <Dialog 
          visible={showContentDialog} 
          onDismiss={() => setShowContentDialog(false)}
          style={styles.dialog}
        >
          <Dialog.Title>
            {editingContent ? 'Upravit obsah' : 'Přidat obsah'}
          </Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={styles.dialogContent}>
              <TextInput
                label="Den (1-365)"
                value={contentForm.day}
                onChangeText={(text) => setContentForm(prev => ({ ...prev, day: text }))}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
              />
              
              <TextInput
                label="Motivace"
                value={contentForm.motivation}
                onChangeText={(text) => setContentForm(prev => ({ ...prev, motivation: text }))}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
              />
              
              <TextInput
                label="Úkol"
                value={contentForm.task}
                onChangeText={(text) => setContentForm(prev => ({ ...prev, task: text }))}
                mode="outlined"
                multiline
                numberOfLines={5}
                style={styles.input}
              />
              
              <View style={styles.checkboxRow}>
                <Text>Je to foto den?</Text>
                <Button
                  mode={contentForm.isPhotoDay ? 'contained' : 'outlined'}
                  onPress={() => setContentForm(prev => ({ 
                    ...prev, 
                    isPhotoDay: !prev.isPhotoDay 
                  }))}
                  compact
                >
                  {contentForm.isPhotoDay ? 'Ano' : 'Ne'}
                </Button>
              </View>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setShowContentDialog(false)}>
              Zrušit
            </Button>
            <Button onPress={saveDailyContent}>
              Uložit
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* Snackbars */}
      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={4000}
        style={styles.errorSnackbar}
      >
        {error}
      </Snackbar>
      
      <Snackbar
        visible={!!success}
        onDismiss={() => setSuccess('')}
        duration={3000}
        style={styles.successSnackbar}
      >
        {success}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  noAccessContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 32,
  },
  noAccessTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ef4444',
    marginTop: 16,
    marginBottom: 8,
  },
  noAccessText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginLeft: 12,
  },
  refreshButton: {
    borderColor: '#ec4899',
  },
  tabBar: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  content: {
    flex: 1,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
  },
  quickActions: {
    gap: 12,
  },
  actionButton: {
    borderRadius: 8,
  },
  searchbar: {
    margin: 16,
    elevation: 2,
  },
  userBadges: {
    alignItems: 'flex-end',
    gap: 4,
  },
  adminBadge: {
    backgroundColor: '#ec4899',
  },
  dayBadge: {
    backgroundColor: '#3b82f6',
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#10b981',
  },
  contentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    borderColor: '#ec4899',
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    fontStyle: 'italic',
    padding: 20,
  },
  dialog: {
    maxHeight: '80%',
  },
  dialogContent: {
    padding: 20,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  errorSnackbar: {
    backgroundColor: '#ef4444',
  },
  successSnackbar: {
    backgroundColor: '#10b981',
  },
});

export default AdminPanelScreen;