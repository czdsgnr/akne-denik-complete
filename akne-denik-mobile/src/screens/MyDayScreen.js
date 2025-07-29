// src/screens/MyDayScreen.js
// 📱 KOMPLETNÍ MOBILNÍ MY DAY SCREEN s Firebase
import React, { useState, useEffect } from 'react';
import { 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  RefreshControl,
  Animated,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Screen,
  Card,
  Button,
  Title,
  Body,
  Caption,
  Row,
  Column,
  colors,
  spacing,
  gradients,
} from '../components/ui';

// Firebase imports
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  updateDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { useSnackbar } from '../components/ui/Snackbar';

const { width: screenWidth } = Dimensions.get('window');

// Countdown Timer komponenta
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow - now;
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeLeft('00:00:00');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Column style={{ alignItems: 'center' }}>
      <Title level={1} style={{ 
        fontFamily: 'monospace',
        fontSize: 32,
        color: colors.text,
        marginBottom: spacing.xs
      }}>
        {timeLeft}
      </Title>
      <Caption>do dalšího dne</Caption>
    </Column>
  );
};

// Streak calculator
const calculateStreak = (userLogs, currentDay) => {
  const logDays = Object.keys(userLogs).map(Number).sort((a, b) => b - a);
  
  if (logDays.length === 0) return 0;
  
  let streak = 0;
  let expectedDay = currentDay - 1;
  
  for (const day of logDays) {
    if (day === expectedDay) {
      streak++;
      expectedDay--;
    } else {
      break;
    }
  }
  
  return streak;
};

const MyDayScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  
  // State
  const [currentDay, setCurrentDay] = useState(1);
  const [currentDayContent, setCurrentDayContent] = useState(null);
  const [userLogs, setUserLogs] = useState({});
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [dailyLog, setDailyLog] = useState({
    mood: 0,
    skinRating: 0,
    note: '',
    completed: false,
    photos: []
  });

  // Animation
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  // Load data
  const loadTodaysData = async (showRefresh = false) => {
    if (!user) return;
    
    if (showRefresh) setRefreshing(true);
    
    try {
      // Načtení aktuálního dne uživatele
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userInfo = userDoc.data();
      const day = userInfo?.currentDay || 1;
      
      setCurrentDay(day);
      setUserData(userInfo);

      // Načtení denního obsahu
      const contentDoc = await getDoc(doc(db, 'dailyContent', `day-${day}`));
      const contentData = contentDoc.exists() ? contentDoc.data() : null;
      setCurrentDayContent(contentData);

      // Načtení uživatelských logů
      const logsQuery = query(
        collection(db, 'userLogs'),
        where('userId', '==', user.uid)
      );
      const logsSnapshot = await getDocs(logsQuery);
      const logs = {};
      logsSnapshot.forEach((doc) => {
        const data = doc.data();
        logs[data.day] = data;
      });
      setUserLogs(logs);

      // Kontrola dnešního záznamu
      const today = new Date();
      const todayString = today.toDateString();
      
      let todayLogExists = false;
      logsSnapshot.forEach((doc) => {
        const logData = doc.data();
        const logDate = logData.createdAt?.toDate?.() || new Date(logData.createdAt);
        if (logDate.toDateString() === todayString) {
          todayLogExists = true;
          setDailyLog({
            mood: logData.mood || 0,
            skinRating: logData.skinRating || 0,
            note: logData.note || '',
            completed: true,
            photos: logData.photos || []
          });
        }
      });
      
      setTodayCompleted(todayLogExists);

      // Animace po načtení
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

    } catch (error) {
      console.error('Chyba při načítání dat:', error);
      showSnackbar({
        message: 'Chyba při načítání dat',
        type: 'error'
      });
    } finally {
      setLoading(false);
      if (showRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTodaysData();
  }, [user]);

  // Handlers
  const handleMoodSelect = (mood) => {
    setDailyLog(prev => ({ ...prev, mood }));
  };

  const handleSkinRating = (rating) => {
    setDailyLog(prev => ({ ...prev, skinRating: rating }));
  };

  const handleCompleteDay = async () => {
    if (!dailyLog.mood || !dailyLog.skinRating) {
      Alert.alert(
        'Neúplné údaje',
        'Prosím, vyplň náladu a hodnocení pleti před dokončením dne.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setSaving(true);

      // Uložení denního logu
      await addDoc(collection(db, 'userLogs'), {
        userId: user.uid,
        day: currentDay,
        mood: dailyLog.mood,
        skinRating: dailyLog.skinRating,
        note: dailyLog.note,
        createdAt: new Date(),
        photos: dailyLog.photos || []
      });

      // Aktualizace uživatele
      await updateDoc(doc(db, 'users', user.uid), {
        currentDay: currentDay + 1,
        completedDays: [...(userData?.completedDays || []), currentDay],
        updatedAt: new Date()
      });

      setTodayCompleted(true);
      
      showSnackbar({
        message: `Den ${currentDay} byl úspěšně dokončen! 🎉`,
        type: 'success'
      });

    } catch (error) {
      console.error('Chyba při ukládání:', error);
      showSnackbar({
        message: 'Chyba při ukládání dat',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const onRefresh = () => {
    loadTodaysData(true);
  };

  if (loading) {
    return (
      <Screen style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Column style={{ alignItems: 'center' }}>
          <Ionicons name="sparkles" size={48} color={colors.primary} />
          <Title level={3} style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
            Načítání tvého dne...
          </Title>
          <Body variant="secondary">Připravujeme ti denní úkoly</Body>
        </Column>
      </Screen>
    );
  }

  const isPhotoDay = currentDayContent?.isPhotoDay || false;
  const completedDaysCount = Object.keys(userLogs).length;
  const streak = calculateStreak(userLogs, currentDay);

  const moods = [
    { value: 1, emoji: '😞', label: 'Špatná' },
    { value: 2, emoji: '😕', label: 'Horší' },
    { value: 3, emoji: '😐', label: 'OK' },
    { value: 4, emoji: '😊', label: 'Dobrá' },
    { value: 5, emoji: '😄', label: 'Skvělá' }
  ];

  const tomorrowMotivations = [
    "Zítra tě čeká nový den plný možností! 🌟",
    "Odpočiň si a připrav se na další krok! ✨",
    "Tvoje pleť se bude zítra těšit na další péči! 💖",
    "Každý nový den je šancí být ještě krásnější! 🌸",
    "Zítřejší den přinese nové tipy! 🎯"
  ];
  
  const randomMotivation = tomorrowMotivations[Math.floor(Math.random() * tomorrowMotivations.length)];

  return (
    <Screen>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header s gradientem */}
        <LinearGradient 
          colors={gradients.primary} 
          style={{ paddingTop: 60, paddingBottom: spacing.xl }}
        >
          <Column style={{ padding: spacing.lg }}>
            <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Row style={{ alignItems: 'center', flex: 1 }}>
                <Column style={{
                  width: 64,
                  height: 64,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: spacing.md
                }}>
                  <Ionicons name="sparkles" size={32} color={colors.white} />
                </Column>
                
                <Column style={{ flex: 1 }}>
                  <Title level={1} style={{ 
                    color: colors.white,
                    fontSize: 28,
                    marginBottom: spacing.xs
                  }}>
                    Ahoj, {userData?.name || 'krásko'}! 👋
                  </Title>
                  <Row style={{ alignItems: 'center' }}>
                    <Ionicons name="calendar" size={16} color="rgba(255,255,255,0.8)" />
                    <Caption style={{ 
                      color: 'rgba(255,255,255,0.8)', 
                      marginLeft: spacing.xs,
                      marginRight: spacing.md
                    }}>
                      Den {currentDay}
                    </Caption>
                    <Ionicons name="flame" size={16} color="rgba(255,255,255,0.8)" />
                    <Caption style={{ 
                      color: 'rgba(255,255,255,0.8)', 
                      marginLeft: spacing.xs
                    }}>
                      {streak} dní v řadě
                    </Caption>
                  </Row>
                </Column>
              </Row>
              
              <Column style={{ alignItems: 'center' }}>
                <Title level={1} style={{ 
                  color: colors.white,
                  fontSize: 48,
                  fontWeight: '700'
                }}>
                  {currentDay}
                </Title>
                <Caption style={{ color: 'rgba(255,255,255,0.8)' }}>
                  z 365 dní
                </Caption>
              </Column>
            </Row>
          </Column>
        </LinearGradient>

        <Animated.View style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          padding: spacing.lg,
          paddingTop: -spacing.md,
          marginTop: -spacing.md
        }}>

          {/* Po dokončení dne - Countdown */}
          {todayCompleted && (
            <Card style={{ 
              backgroundColor: colors.successLight,
              borderColor: colors.success,
              borderWidth: 1,
              marginBottom: spacing.lg
            }}>
              <Column style={{ alignItems: 'center', padding: spacing.lg }}>
                <Column style={{
                  width: 64,
                  height: 64,
                  backgroundColor: colors.success,
                  borderRadius: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: spacing.md
                }}>
                  <Ionicons name="checkmark-circle" size={32} color={colors.white} />
                </Column>
                
                <Title level={3} style={{ 
                  textAlign: 'center',
                  marginBottom: spacing.sm
                }}>
                  Skvělá práce! Den {currentDay} dokončen! 🎉
                </Title>
                
                <Body style={{ 
                  textAlign: 'center',
                  color: colors.textSecondary,
                  marginBottom: spacing.lg
                }}>
                  Už jsi dnes vyplnila svůj denní záznam. Počkej si na další den!
                </Body>

                <Card style={{ 
                  backgroundColor: colors.white,
                  width: '100%',
                  marginBottom: spacing.md
                }}>
                  <Row style={{ 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    padding: spacing.lg
                  }}>
                    <Row style={{ 
                      alignItems: 'center',
                      marginRight: spacing.lg
                    }}>
                      <Ionicons name="time" size={20} color={colors.info} />
                      <Caption style={{ 
                        marginLeft: spacing.sm,
                        fontWeight: '500'
                      }}>
                        Další den za:
                      </Caption>
                    </Row>
                    <CountdownTimer />
                  </Row>
                </Card>

                <Card style={{ 
                  backgroundColor: colors.primaryExtraLight,
                  borderColor: colors.primaryLight,
                  borderWidth: 1,
                  width: '100%'
                }}>
                  <Column style={{ 
                    alignItems: 'center',
                    padding: spacing.md
                  }}>
                    <Row style={{ 
                      alignItems: 'center',
                      marginBottom: spacing.sm
                    }}>
                      <Ionicons name="gift" size={20} color={colors.primary} />
                      <Caption style={{ 
                        marginLeft: spacing.sm,
                        fontWeight: '500',
                        color: colors.text
                      }}>
                        Na co se můžeš těšit
                      </Caption>
                    </Row>
                    <Body style={{ 
                      textAlign: 'center',
                      color: colors.textSecondary,
                      fontSize: 14
                    }}>
                      {randomMotivation}
                    </Body>
                  </Column>
                </Card>
              </Column>
            </Card>
          )}

          {/* Quick Stats */}
          <Row style={{ marginBottom: spacing.lg }}>
            <Card style={{ 
              flex: 1, 
              marginRight: spacing.sm,
              marginBottom: 0 
            }}>
              <Column style={{ alignItems: 'center', padding: spacing.md }}>
                <Column style={{
                  width: 32,
                  height: 32,
                  backgroundColor: colors.successLight,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: spacing.xs
                }}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                </Column>
                <Title level={3} style={{ color: colors.text }}>
                  {completedDaysCount}
                </Title>
                <Caption>Splněno</Caption>
              </Column>
            </Card>

            <Card style={{ 
              flex: 1, 
              marginLeft: spacing.sm,
              marginRight: spacing.sm,
              marginBottom: 0 
            }}>
              <Column style={{ alignItems: 'center', padding: spacing.md }}>
                <Column style={{
                  width: 32,
                  height: 32,
                  backgroundColor: colors.warningLight,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: spacing.xs
                }}>
                  <Ionicons name="flame" size={16} color={colors.warning} />
                </Column>
                <Title level={3} style={{ color: colors.text }}>
                  {streak}
                </Title>
                <Caption>V řadě</Caption>
              </Column>
            </Card>

            <Card style={{ 
              flex: 1, 
              marginLeft: spacing.sm,
              marginBottom: 0 
            }}>
              <Column style={{ alignItems: 'center', padding: spacing.md }}>
                <Column style={{
                  width: 32,
                  height: 32,
                  backgroundColor: colors.infoLight,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: spacing.xs
                }}>
                  <Ionicons name="calendar" size={16} color={colors.info} />
                </Column>
                <Title level={3} style={{ color: colors.text }}>
                  {365 - currentDay}
                </Title>
                <Caption>Zbývá</Caption>
              </Column>
            </Card>
          </Row>

          {/* Denní motivace */}
          <Card style={{ marginBottom: spacing.lg }}>
            <Row style={{ alignItems: 'flex-start', padding: spacing.lg }}>
              <Column style={{
                width: 48,
                height: 48,
                backgroundColor: colors.primaryLight,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: spacing.md
              }}>
                <Ionicons name="sparkles" size={24} color={colors.primary} />
              </Column>
              <Column style={{ flex: 1 }}>
                <Title level={4} style={{ marginBottom: spacing.sm }}>
                  Denní motivace
                </Title>
                <Body style={{ 
                  lineHeight: 22,
                  color: colors.textSecondary
                }}>
                  {currentDayContent?.motivation || 
                   `Už ${currentDay} dní děláš skvělou práci! Tvoje pleť se postupně zlepšuje a ty si to zasloužíš! 💖`}
                </Body>
              </Column>
            </Row>
          </Card>

          {/* Dnešní úkol */}
          <Card style={{ marginBottom: spacing.lg }}>
            <Column style={{ padding: spacing.lg }}>
              <Row style={{ 
                alignItems: 'center',
                marginBottom: spacing.md
              }}>
                <Column style={{
                  width: 48,
                  height: 48,
                  backgroundColor: colors.infoLight,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: spacing.md
                }}>
                  <Ionicons name="target" size={24} color={colors.info} />
                </Column>
                <Column style={{ flex: 1 }}>
                  <Title level={4}>Dnešní úkol</Title>
                  {isPhotoDay && (
                    <Row style={{ alignItems: 'center', marginTop: spacing.xs }}>
                      <Ionicons name="camera" size={16} color={colors.warning} />
                      <Caption style={{ 
                        marginLeft: spacing.xs,
                        color: colors.warning,
                        fontWeight: '500'
                      }}>
                        Foto den - týden {Math.ceil(currentDay / 7)}
                      </Caption>
                    </Row>
                  )}
                </Column>
              </Row>
              
              <Card style={{ 
                backgroundColor: colors.gray50,
                borderWidth: 0,
                marginBottom: 0
              }}>
                <Body style={{ 
                  lineHeight: 20,
                  fontSize: 14,
                  fontFamily: 'monospace'
                }}>
                  {currentDayContent?.task || 
                   `🎯 DEN ${currentDay} - DŮVĚŘUJ PROCESU!

📌 VZPOMEŇ SI:
Kdy jsi naposledy dostala kompliment na svou pleť?

💪 ÚKOL:
Dnes se podívej do zrcadla a najdi 3 věci, které se ti na své pleti líbí.
⭐ Napiš si je do poznámky a usmej se na sebe!`}
                </Body>
              </Card>
            </Column>
          </Card>

          {/* Denní záznam - pouze pokud není dokončen */}
          {!todayCompleted && (
            <Card style={{ marginBottom: spacing.xxxl }}>
              <Column style={{ padding: spacing.lg }}>
                <Row style={{ 
                  alignItems: 'center',
                  marginBottom: spacing.lg
                }}>
                  <Ionicons name="heart" size={24} color={colors.error} />
                  <Title level={4} style={{ marginLeft: spacing.sm }}>
                    Jak se dnes cítíš?
                  </Title>
                </Row>

                {/* Nálada */}
                <Column style={{ marginBottom: spacing.lg }}>
                  <Body style={{ 
                    fontWeight: '500',
                    marginBottom: spacing.md
                  }}>
                    Celková nálada
                  </Body>
                  <Row style={{ justifyContent: 'space-between' }}>
                    {moods.map((mood) => (
                      <TouchableOpacity
                        key={mood.value}
                        onPress={() => handleMoodSelect(mood.value)}
                        style={{
                          width: (screenWidth - spacing.lg * 2 - spacing.lg * 2 - spacing.sm * 4) / 5,
                          padding: spacing.sm,
                          borderRadius: 12,
                          borderWidth: 2,
                          borderColor: dailyLog.mood === mood.value ? colors.primary : colors.borderLight,
                          backgroundColor: dailyLog.mood === mood.value ? colors.primaryExtraLight : colors.surface,
                          alignItems: 'center',
                        }}
                      >
                        <Body style={{ 
                          fontSize: 24,
                          marginBottom: spacing.xs
                        }}>
                          {mood.emoji}
                        </Body>
                        <Caption style={{
                          textAlign: 'center',
                          color: dailyLog.mood === mood.value ? colors.primary : colors.textSecondary,
                          fontWeight: dailyLog.mood === mood.value ? '500' : '400',
                          fontSize: 11
                        }}>
                          {mood.label}
                        </Caption>
                      </TouchableOpacity>
                    ))}
                  </Row>
                </Column>

                {/* Hodnocení pleti */}
                <Column style={{ marginBottom: spacing.lg }}>
                  <Body style={{ 
                    fontWeight: '500',
                    marginBottom: spacing.md
                  }}>
                    Hodnocení pleti (1-5 hvězdiček)
                  </Body>
                  <Row style={{ justifyContent: 'center' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity
                        key={star}
                        onPress={() => handleSkinRating(star)}
                        style={{
                          padding: spacing.sm,
                          borderRadius: 8,
                          marginHorizontal: spacing.xs
                        }}
                      >
                        <Ionicons
                          name={star <= dailyLog.skinRating ? "star" : "star-outline"}
                          size={32}
                          color={star <= dailyLog.skinRating ? colors.warning : colors.borderMedium}
                        />
                      </TouchableOpacity>
                    ))}
                  </Row>
                </Column>

                {/* Poznámka */}
                <Column style={{ marginBottom: spacing.xl }}>
                  <Body style={{ 
                    fontWeight: '500',
                    marginBottom: spacing.sm
                  }}>
                    Poznámka (volitelné)
                  </Body>
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 12,
                      padding: spacing.md,
                      backgroundColor: colors.surface,
                      minHeight: 80,
                      justifyContent: 'flex-start'
                    }}
                    onPress={() => {
                      // TODO: Implementovat text input
                      showSnackbar({
                        message: 'Textové pole bude brzy dostupné',
                        type: 'info'
                      });
                    }}
                  >
                    <Body style={{ 
                      color: dailyLog.note ? colors.text : colors.textPlaceholder 
                    }}>
                      {dailyLog.note || 'Jak se dnes cítíš? Nějaké změny na pleti?'}
                    </Body>
                  </TouchableOpacity>
                </Column>

                {/* Foto sekce pro foto dny */}
                {isPhotoDay && (
                  <Card style={{ 
                    backgroundColor: colors.infoLight,
                    borderColor: colors.info,
                    borderWidth: 1,
                    marginBottom: spacing.lg
                  }}>
                    <Column style={{ padding: spacing.md }}>
                      <Row style={{ 
                        alignItems: 'flex-start',
                        marginBottom: spacing.sm
                      }}>
                        <Column style={{
                          width: 40,
                          height: 40,
                          backgroundColor: colors.info,
                          borderRadius: 10,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: spacing.sm
                        }}>
                          <Ionicons name="camera" size={20} color={colors.white} />
                        </Column>
                        <Column style={{ flex: 1 }}>
                          <Body style={{ 
                            fontWeight: '600',
                            marginBottom: spacing.xs,
                            color: colors.text
                          }}>
                            Povinná fotodokumentace - Den {currentDay}
                          </Body>
                          <Body style={{ 
                            fontSize: 14,
                            color: colors.textSecondary,
                            marginBottom: spacing.sm,
                            lineHeight: 18
                          }}>
                            Dnes je čas na týdenní fotografii pokroku! Pořiď si selfie svého obličeje. 📸
                          </Body>
                          <Column style={{ gap: spacing.xs }}>
                            <Body style={{ fontSize: 12, color: colors.textMuted }}>
                              💡 <Body style={{ fontWeight: '600' }}>Tip:</Body> Foť se vždy za stejného světla
                            </Body>
                            <Body style={{ fontSize: 12, color: colors.textMuted }}>
                              🔒 <Body style={{ fontWeight: '600' }}>Soukromí:</Body> Tvoje fotky jsou pouze tvoje
                            </Body>
                          </Column>
                        </Column>
                      </Row>
                      
                      <Button
                        title="📸 Přidat fotku"
                        variant="outline"
                        onPress={() => {
                          showSnackbar({
                            message: 'Funkce fotoaparátu bude brzy dostupná',
                            type: 'info'
                          });
                        }}
                        style={{
                          borderColor: colors.info,
                        }}
                        textStyle={{
                          color: colors.info
                        }}
                      />
                    </Column>
                  </Card>
                )}

                {/* Dokončit den */}
                <Button
                  title={saving ? "Ukládám..." : (isPhotoDay ? 'Dokončit den + foto' : 'Dokončit den')}
                  onPress={handleCompleteDay}
                  loading={saving}
                  disabled={saving || !dailyLog.mood || !dailyLog.skinRating}
                  fullWidth
                  size="large"
                  style={{
                    backgroundColor: colors.primary,
                    minHeight: 56
                  }}
                  icon="target"
                />
                
                {/* Info o povinnosti fotky */}
                {isPhotoDay && (
                  <Row style={{ 
                    justifyContent: 'center',
                    marginTop: spacing.md,
                    alignItems: 'center'
                  }}>
                    <Ionicons name="camera" size={16} color={colors.warning} />
                    <Caption style={{ 
                      marginLeft: spacing.xs,
                      color: colors.warning
                    }}>
                      Foto je dnes povinné pro dokončení dne
                    </Caption>
                  </Row>
                )}
              </Column>
            </Card>
          )}
        </Animated.View>
      </ScrollView>
      
      <SnackbarComponent />
    </Screen>
  );
};

export default MyDayScreen;