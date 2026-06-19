import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput, Keyboard } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowUp, MoreHorizontal, MessageSquare } from 'lucide-react-native';
import { useTheme } from '../../../src/hooks';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { ManjeCharacter } from '../../../src/components/character/ManjeCharacter';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  time: string;
};

export default function ActiveChatScreen() {
  const { topic } = useLocalSearchParams();
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: topic === 'budget' ? "Let's build a budget together. What's your main priority this month?" :
             topic === 'insights' ? "I've analyzed your recent spending. What would you like to know?" :
             "Hi! I'm Manje. How can I help you with your finances today?",
      sender: 'ai',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "That makes sense. I can help you with that. Would you like to set up a specific goal or just track it generally for now?",
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  useEffect(() => {
    // Scroll to bottom when messages change
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
        title="Manje AI" 
        showBack 
        onBackPress={() => router.back()}
        rightAction={
          <TouchableOpacity style={{ padding: 8 }}>
            <MoreHorizontal size={24} color={colors.text.primary} />
          </TouchableOpacity>
        }
      />
      
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
                <ManjeCharacter mood="happy" size="sm" variant="badge" />
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
            </View>
          </View>
        ))}

        {isTyping && (
          <View style={[styles.messageWrapper, styles.messageWrapperAI]}>
            <View style={styles.aiAvatar}>
              <ManjeCharacter mood="thinking" size="sm" variant="badge" animated />
            </View>
            <View style={[styles.messageBubble, styles.messageAI, { backgroundColor: colors.background.card, borderColor: colors.border.light }]}>
              <Text style={[typography.body.large, { color: colors.text.muted }]}>Typing...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.inputContainer, { backgroundColor: colors.background.base, borderTopColor: colors.border.light }]}>
        <TextInput
          style={[styles.input, typography.body.large, { color: colors.text.primary, backgroundColor: colors.background.sunken }]}
          placeholder="Ask me anything..."
          placeholderTextColor={colors.text.muted}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
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
