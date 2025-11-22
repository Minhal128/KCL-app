import React from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

/**
 * A simple replacement for KeyboardAwareScrollView that works with Expo Go
 * Uses native KeyboardAvoidingView + ScrollView instead
 */
export default function KeyboardAvoidingScrollView({ 
  children, 
  contentContainerStyle,
  enableOnAndroid,
  extraScrollHeight,
  keyboardShouldPersistTaps = "handled",
  ...props 
}) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={contentContainerStyle}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        {...props}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
