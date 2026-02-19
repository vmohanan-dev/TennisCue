import { Button } from '@/components/Button';
import { Colors } from '@/constants/Colors';
import { useAuthStore, useSessionStore, useUserStore } from '@/store';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, isLoading, clearError } = useAuthStore();
  const { mergeAndSync: mergeUserData } = useUserStore();
  const { mergeAndSync: mergeSessionData } = useSessionStore();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    clearError();
    const result = await signIn(email.trim(), password);

    if (result.success) {
      // Auto-merge local data with cloud data after successful login
      const user = useAuthStore.getState().user;
      if (user) {
        try {
          await Promise.all([mergeUserData(user.id), mergeSessionData(user.id)]);
        } catch (error) {
          console.error('Error syncing data after login:', error);
        }
      }
    } else {
      Alert.alert('Sign In Failed', result.error || 'Please try again');
    }
    // Navigation handled by auth state change in _layout.tsx
  };

  const checkNetwork = async () => {
    try {
      console.log('Testing network connection (IP check)...');
      // Test 1: Direct IP (Cloudflare) to rule out DNS
      const response = await fetch('https://1.1.1.1');
      console.log('IP-based fetch status:', response.status);

      console.log('Testing domain fetch...');
      const response2 = await fetch('https://www.google.com');
      console.log('Domain fetch status:', response2.status);

      Alert.alert('Network OK', `IP: ${response.status}, Domain: ${response2.status}`);
    } catch (e: any) {
      console.error('Network check failed details:', {
        message: e.message,
        candidate: e,
        stack: e.stack,
      });
      // Try XMLHttpRequest as a fallback check
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://www.google.com');
      xhr.onload = () => console.log('XHR Status:', xhr.status);
      xhr.onerror = () => console.log('XHR Error');
      xhr.send();

      Alert.alert('Network Error', `${e.message}\n(Check logs for details)`);
    }
  };

  const handleSignUp = () => {
    router.push('/(auth)/signup');
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>🎾</Text>
            </View>
          </View>

          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue your tennis journey</Text>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <FontAwesome name="envelope" size={18} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={Colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome name="lock" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={Colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <FontAwesome
                  name={showPassword ? 'eye' : 'eye-slash'}
                  size={18}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleLogin}
              size="large"
              loading={isLoading}
              disabled={isLoading}
              style={styles.signInButton}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={checkNetwork} style={{ alignItems: 'center', padding: 10 }}>
          <Text style={{ color: Colors.textSecondary }}>Test Network Connection</Text>
        </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontSize: 45,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
    width: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  signInButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 30,
    paddingTop: 20,
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  signUpLink: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
