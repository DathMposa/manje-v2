import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowUp, ArrowRight, PieChart } from 'lucide-react-native';
import { useTheme } from '../../../src/hooks';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { ManjeCharacter } from '../../../src/components/character/ManjeCharacter';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  action?: boolean;
};

export default function AIBudgetCreationScreen() {
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! Let's build a budget that works for you. I'll ask a few questions to get started. First, what's your total expected income this month?",
      sender: 'ai'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(1);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI flow based on steps
    setTimeout(() => {
      let aiMessage: Message;
      
      if (step === 1) {
        aiMessage = {
          id: (Date.now() + 1).toString(),
          text: "Got it. Now, how much do you typically spend on fixed essentials like rent, utilities, and transport?",
          sender: 'ai'
        };
        setStep(2);
      } else if (step === 2) {
        aiMessage = {
          id: (Date.now() + 1).toString(),
          text: "Great. It's important to save! How much would you like to put towards savings or emergency fund this month?",
          sender: 'ai'
        };
        setStep(3);
      } else {
        aiMessage = {
          id: (Date.now() + 1).toString(),
          text: "Perfect. Based on your answers, I've generated a suggested budget for you. You have about 30% left for discretionary spending. Let's review it.",
          sender: 'ai',
          action: true
        };
        setStep(4);
      }
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: colors.background.base }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader 
        title="AI Budget Creator" 
        showBack 
        onBackPress={() => router.back()}
      />
      
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: colors.border.light }]}>
          <View style={[styles.progressFill, { backgroundColor: colors.primary.base, width: `${(step / 4) * 100}%` }]} />
        </View>
        <Text style={[typography.label.small, { color: colors.text.muted, marginTop: 8, textAlign: 'center' }]}>
          Step {step} of 4
        </Text>
      </View>
      
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.md }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View 
            key={msg.id} 
            style={[
              styles.messageWrapper, 
              msg.sender === 'user' ? styles.messageWrapperUser : styles.messageWrapperAI
            ]}
          >
            {msg.sender === 'ai' && (
              <View style={styles.aiAvatar}>
                <ManjeCharacter mood={msg.action ? "celebrate" : "happy"} size="sm" />
              </View>
            )}
            
            <View 
              style={[
                styles.messageBubble, 
                msg.sender === 'user' 
                  ? [styles.messageUser, { backgroundColor: colors.primary.base }] 
                  : [styles.messageAI, { backgroundColor: colors.background.card, borderColor: colors.border.light }]
              ]}
            >
              <Text style={[
                typography.body.large, 
                { color: msg.sender === 'user' ? colors.text.inverse : colors.text.primary }
              ]}>
                {msg.text}
              </Text>
              
              {msg.action && (
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: colors.primary.base }]}
                  activeOpacity={0.8}
                  onPress={() => router.push('/(tabs)/budgets/create/manual')}
                >
                  <PieChart size={20} color={colors.text.inverse} style={{ marginRight: 8 }} />
                  <Text style={[typography.headline.small, { color: colors.text.inverse }]}>Review Budget</Text>
                  <ArrowRight size={20} color={colors.text.inverse} style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {isTyping && (
          <View style={[styles.messageWrapper, styles.messageWrapperAI]}>
            <View style={styles.aiAvatar}>
              <ManjeCharacter mood="thinking" size="sm" animated />
            </View>
            <View style={[styles.messageBubble, styles.messageAI, { backgroundColor: colors.background.card, borderColor: colors.border.light }]}>
              <Text style={[typography.body.large, { color: colors.text.muted }]}>Thinking...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {step <= 3 && (
        <View style={[styles.inputContainer, { backgroundColor: colors.background.base, borderTopColor: colors.border.light }]}>
          <TextInput
            style={[styles.input, typography.body.large, { color: colors.text.primary, backgroundColor: colors.background.sunken }]}
            placeholder={step === 1 ? "e.g. 150,000" : "Type your answer..."}
            placeholderTextColor={colors.text.muted}
            value={input}
            onChangeText={setInput}
            keyboardType={step === 1 || step === 2 || step === 3 ? "numeric" : "default"}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              { backgroundColor: input.trim() ? colors.primary.base : colors.border.medium }
            ]}
            onPress={handleSend}
            disabled={!input.trim()}
            activeOpacity={0.7}
          >
            <ArrowUp size={20} color={colors.text.inverse} />
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 20,
    maxWidth: '85%',
  },
  messageWrapperUser: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  messageWrapperAI: {
    alignSelf: 'flex-start',
    alignItems: 'flex-end',
  },
  aiAvatar: {
    marginRight: 8,
    marginBottom: -4,
  },
  messageBubble: {
    padding: 16,
    borderRadius: 20,
  },
  messageUser: {
    borderBottomRightRadius: 4,
  },
  messageAI: {
    borderWidth: 1,
    borderBottomLeftRadius: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
