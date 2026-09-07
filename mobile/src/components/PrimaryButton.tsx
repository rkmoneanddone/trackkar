import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {colors, radius, spacing} from '../theme/tokens';
export function PrimaryButton({label,onPress}:{label:string;onPress:()=>void}) {
  return <Pressable style={styles.button} onPress={onPress}><Text style={styles.label}>{label}</Text></Pressable>;
}
const styles=StyleSheet.create({button:{backgroundColor:colors.primary,borderRadius:radius.sm,paddingVertical:13,paddingHorizontal:spacing.md,alignItems:'center'},label:{color:'#FFFFFF',fontSize:15,fontWeight:'700'}});
