import React, { useEffect } from "react";
import MonacoEditor, { MonacoDiffEditor } from "react-monaco-editor";

interface IProps {}

const bicOldCode = `/**\n * Copyright (C) 2006-2018 INRIA and contributors\n * Spoon - http://spoon.gforge.inria.fr/\n *\n * This software is governed by the CeCILL-C License under French law and\n * abiding by the rules of distribution of free software. You can use, modify\n * and/or redistribute the software under the terms of the CeCILL-C license as\n * circulated by CEA, CNRS and INRIA at http://www.cecill.info.\n *\n * This program is distributed in the hope that it will be useful, but WITHOUT\n * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or\n * FITNESS FOR A PARTICULAR PURPOSE. See the CeCILL-C License for more details.\n *\n * The fact that you are presently reading this means that you have had\n * knowledge of the CeCILL-C license and that you accept its terms.\n */\npackage spoon.support.reflect.reference;\n\nimport spoon.Launcher;\nimport spoon.reflect.annotations.MetamodelPropertyField;\nimport spoon.reflect.declaration.CtEnum;\nimport spoon.reflect.declaration.CtField;\nimport spoon.reflect.declaration.CtType;\nimport spoon.reflect.declaration.CtVariable;\nimport spoon.reflect.declaration.ModifierKind;\nimport spoon.reflect.reference.CtFieldReference;\nimport spoon.reflect.reference.CtTypeReference;\nimport spoon.reflect.visitor.CtVisitor;\nimport spoon.support.util.RtHelper;\n\nimport java.lang.reflect.AnnotatedElement;\nimport java.lang.reflect.Member;\nimport java.util.Collections;\nimport java.util.Set;\n\nimport static spoon.reflect.path.CtRole.DECLARING_TYPE;\nimport static spoon.reflect.path.CtRole.IS_FINAL;\nimport static spoon.reflect.path.CtRole.IS_STATIC;\n\npublic class CtFieldReferenceImpl<T> extends CtVariableReferenceImpl<T> implements CtFieldReference<T> {\n\tprivate static final long serialVersionUID = 1L;\n\n\t@MetamodelPropertyField(role = DECLARING_TYPE)\n\tCtTypeReference<?> declaringType;\n\n\t@MetamodelPropertyField(role = IS_FINAL)\n\tboolean fina = false;\n\n\t@MetamodelPropertyField(role = IS_STATIC)\n\tboolean stat = false;\n\n\tpublic CtFieldReferenceImpl() {\n\t}\n\n\t@Override\n\tpublic void accept(CtVisitor visitor) {\n\t\tvisitor.visitCtFieldReference(this);\n\t}\n\n\t@Override\n\tpublic Member getActualField() {\n\t\ttry {\n\t\t\tif (getDeclaringType().getActualClass().isAnnotation()) {\n\t\t\t\treturn getDeclaringType().getActualClass().getDeclaredMethod(\n\t\t\t\t\t\tgetSimpleName());\n\t\t\t}\n\t\t\treturn getDeclaringType().getActualClass().getDeclaredField(\n\t\t\t\t\tgetSimpleName());\n\t\t} catch (Exception e) {\n\t\t\tLauncher.LOGGER.error(e.getMessage(), e);\n\t\t}\n\t\treturn null;\n\t}\n\n\t@Override\n\tprotected AnnotatedElement getActualAnnotatedElement() {\n\t\treturn (AnnotatedElement) getActualField();\n\t}\n\n\t// @Override\n\t// public <A extends Annotation> A getAnnotation(Class<A> annotationType) {\n\t// A annotation = super.getAnnotation(annotationType);\n\t// if (annotation != null) {\n\t// return annotation;\n\t// }\n\t// // use reflection\n\t// Class<?> c = getDeclaringType().getActualClass();\n\t// if (c.isAnnotation()) {\n\t// for (Method m : RtHelper.getAllMethods(c)) {\n\t// if (!getSimpleName().equals(m.getName())) {\n\t// continue;\n\t// }\n\t// m.setAccessible(true);\n\t// return m.getAnnotation(annotationType);\n\t// }\n\t// } else {\n\t// for (Field f : RtHelper.getAllFields(c)) {\n\t// if (!getSimpleName().equals(f.getName())) {\n\t// continue;\n\t// }\n\t// f.setAccessible(true);\n\t// return f.getAnnotation(annotationType);\n\t// }\n\t// }\n\t// return null;\n\t// }\n\n\t// @Override\n\t// public Annotation[] getAnnotations() {\n\t// Annotation[] annotations = super.getAnnotations();\n\t// if (annotations != null) {\n\t// return annotations;\n\t// }\n\t// // use reflection\n\t// Class<?> c = getDeclaringType().getActualClass();\n\t// for (Field f : RtHelper.getAllFields(c)) {\n\t// if (!getSimpleName().equals(f.getName())) {\n\t// continue;\n\t// }\n\t// f.setAccessible(true);\n\t// return f.getAnnotations();\n\t// }\n\t// // If the fields belong to an annotation type, they are actually\n\t// // methods\n\t// for (Method m : RtHelper.getAllMethods(c)) {\n\t// if (!getSimpleName().equals(m.getName())) {\n\t// continue;\n\t// }\n\t// m.setAccessible(true);\n\t// return m.getAnnotations();\n\t// }\n\t// return null;\n\t// }\n\n\t@Override\n\t@SuppressWarnings("unchecked")\n\tpublic CtField<T> getDeclaration() {\n\t\treturn fromDeclaringType();\n\t}\n\n\tprivate CtField<T> fromDeclaringType() {\n\t\tif (declaringType == null) {\n\t\t\treturn null;\n\t\t}\n\t\tCtType<?> type = declaringType.getDeclaration();\n\t\tif (type != null) {\n\t\t\treturn (CtField<T>) type.getField(getSimpleName());\n\t\t}\n\t\treturn null;\n\t}\n\n\t@Override\n\tpublic CtField<T> getFieldDeclaration() {\n\t\tif (declaringType == null) {\n\t\t\treturn null;\n\t\t}\n\t\tCtType<?> type = declaringType.getTypeDeclaration();\n\t\tif (type != null) {\n\t\t\tfinal CtField<T> ctField = (CtField<T>) type.getField(getSimpleName());\n\t\t\tif (ctField == null && type instanceof CtEnum) {\n\t\t\t\treturn ((CtEnum) type).getEnumValue(getSimpleName());\n\t\t\t}\n\t\t\treturn ctField;\n\t\t}\n\t\treturn null;\n\t}\n\n\t@Override\n\tpublic CtTypeReference<?> getDeclaringType() {\n\t\treturn declaringType;\n\t}\n\n\t@Override\n\tpublic String getQualifiedName() {\n\t\tCtTypeReference<?> declaringType = getDeclaringType();\n\n\t\tif (declaringType != null) {\n\t\t\treturn getDeclaringType().getQualifiedName() + "#" + getSimpleName();\n\t\t} else {\n\t\t\treturn  "<unknown>#" + getSimpleName();\n\t\t}\n\t}\n\n\t@Override\n\tpublic boolean isFinal() {\n\t\treturn fina;\n\t}\n\n\t/**\n\t * Tells if the referenced field is static.\n\t */\n\t@Override\n\tpublic boolean isStatic() {\n\t\treturn stat;\n\t}\n\n\t@Override\n\tpublic <C extends CtFieldReference<T>> C setDeclaringType(CtTypeReference<?> declaringType) {\n\t\tif (declaringType != null) {\n\t\t\tdeclaringType.setParent(this);\n\t\t}\n\t\tgetFactory().getEnvironment().getModelChangeListener().onObjectUpdate(this, DECLARING_TYPE, declaringType, this.declaringType);\n\t\tthis.declaringType = declaringType;\n\t\treturn (C) this;\n\t}\n\n\t@Override\n\tpublic <C extends CtFieldReference<T>> C setFinal(boolean fina) {\n\t\tgetFactory().getEnvironment().getModelChangeListener().onObjectUpdate(this, IS_FINAL, fina, this.fina);\n\t\tthis.fina = fina;\n\t\treturn (C) this;\n\t}\n\n\t@Override\n\tpublic <C extends CtFieldReference<T>> C setStatic(boolean stat) {\n\t\tgetFactory().getEnvironment().getModelChangeListener().onObjectUpdate(this, IS_STATIC, stat, this.stat);\n\t\tthis.stat = stat;\n\t\treturn (C) this;\n\t}\n\n\t@Override\n\tpublic Set<ModifierKind> getModifiers() {\n\t\tCtVariable<?> v = getDeclaration();\n\t\tif (v != null) {\n\t\t\treturn v.getModifiers();\n\t\t}\n\t\tMember m = getActualField();\n\t\tif (m != null) {\n\t\t\treturn RtHelper.getModifiers(m.getModifiers());\n\t\t}\n\t\treturn Collections.emptySet();\n\t}\n\n\t@Override\n\tpublic CtFieldReference<T> clone() {\n\t\treturn (CtFieldReference<T>) super.clone();\n\t}\n}\n`;
const bicNewCode = `/**\n * Copyright (C) 2006-2018 INRIA and contributors\n * Spoon - http://spoon.gforge.inria.fr/\n *\n * This software is governed by the CeCILL-C License under French law and\n * abiding by the rules of distribution of free software. You can use, modify\n * and/or redistribute the software under the terms of the CeCILL-C license as\n * circulated by CEA, CNRS and INRIA at http://www.cecill.info.\n *\n * This program is distributed in the hope that it will be useful, but WITHOUT\n * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or\n * FITNESS FOR A PARTICULAR PURPOSE. See the CeCILL-C License for more details.\n *\n * The fact that you are presently reading this means that you have had\n * knowledge of the CeCILL-C license and that you accept its terms.\n */\npackage spoon.support.reflect.reference;\n\nimport spoon.Launcher;\nimport spoon.SpoonException;\nimport spoon.reflect.annotations.MetamodelPropertyField;\nimport spoon.reflect.declaration.CtEnum;\nimport spoon.reflect.declaration.CtField;\nimport spoon.reflect.declaration.CtType;\nimport spoon.reflect.declaration.CtVariable;\nimport spoon.reflect.declaration.ModifierKind;\nimport spoon.reflect.reference.CtFieldReference;\nimport spoon.reflect.reference.CtTypeReference;\nimport spoon.reflect.visitor.CtVisitor;\nimport spoon.support.SpoonClassNotFoundException;\nimport spoon.support.util.RtHelper;\n\nimport java.lang.reflect.AnnotatedElement;\nimport java.lang.reflect.Member;\nimport java.util.Collections;\nimport java.util.Set;\n\nimport static spoon.reflect.path.CtRole.DECLARING_TYPE;\nimport static spoon.reflect.path.CtRole.IS_FINAL;\nimport static spoon.reflect.path.CtRole.IS_STATIC;\n\npublic class CtFieldReferenceImpl<T> extends CtVariableReferenceImpl<T> implements CtFieldReference<T> {\n\tprivate static final long serialVersionUID = 1L;\n\n\t@MetamodelPropertyField(role = DECLARING_TYPE)\n\tCtTypeReference<?> declaringType;\n\n\t@MetamodelPropertyField(role = IS_FINAL)\n\tboolean fina = false;\n\n\t@MetamodelPropertyField(role = IS_STATIC)\n\tboolean stat = false;\n\n\tpublic CtFieldReferenceImpl() {\n\t}\n\n\t@Override\n\tpublic void accept(CtVisitor visitor) {\n\t\tvisitor.visitCtFieldReference(this);\n\t}\n\n\t@Override\n\tpublic Member getActualField() {\n\t\tCtTypeReference<?> typeRef = getDeclaringType();\n\t\tif (typeRef == null) {\n\t\t\tthrow new SpoonException("Declaring type of field " + getSimpleName() + " isn\'t defined");\n\t\t}\n\t\tClass<?> clazz;\n\t\ttry {\n\t\t\tclazz = typeRef.getActualClass();\n\t\t} catch (SpoonClassNotFoundException e) {\n\t\t\tif (getFactory().getEnvironment().getNoClasspath()) {\n\t\t\t\tLauncher.LOGGER.info("The class " + typeRef.getQualifiedName() + " of field " + getSimpleName() + " is not on class path. Problem ignored in noclasspath mode");\n\t\t\t\treturn null;\n\t\t\t}\n\t\t\tthrow e;\n\t\t}\n\t\ttry {\n\t\t\tif (clazz.isAnnotation()) {\n\t\t\t\treturn clazz.getDeclaredMethod(getSimpleName());\n\t\t\t} else {\n\t\t\t\treturn clazz.getDeclaredField(getSimpleName());\n\t\t\t}\n\t\t} catch (NoSuchMethodException | NoSuchFieldException e) {\n\t\t\tthrow new SpoonException("The field " + getQualifiedName() + " not found", e);\n\t\t}\n\t}\n\n\t@Override\n\tprotected AnnotatedElement getActualAnnotatedElement() {\n\t\treturn (AnnotatedElement) getActualField();\n\t}\n\n\t// @Override\n\t// public <A extends Annotation> A getAnnotation(Class<A> annotationType) {\n\t// A annotation = super.getAnnotation(annotationType);\n\t// if (annotation != null) {\n\t// return annotation;\n\t// }\n\t// // use reflection\n\t// Class<?> c = getDeclaringType().getActualClass();\n\t// if (c.isAnnotation()) {\n\t// for (Method m : RtHelper.getAllMethods(c)) {\n\t// if (!getSimpleName().equals(m.getName())) {\n\t// continue;\n\t// }\n\t// m.setAccessible(true);\n\t// return m.getAnnotation(annotationType);\n\t// }\n\t// } else {\n\t// for (Field f : RtHelper.getAllFields(c)) {\n\t// if (!getSimpleName().equals(f.getName())) {\n\t// continue;\n\t// }\n\t// f.setAccessible(true);\n\t// return f.getAnnotation(annotationType);\n\t// }\n\t// }\n\t// return null;\n\t// }\n\n\t// @Override\n\t// public Annotation[] getAnnotations() {\n\t// Annotation[] annotations = super.getAnnotations();\n\t// if (annotations != null) {\n\t// return annotations;\n\t// }\n\t// // use reflection\n\t// Class<?> c = getDeclaringType().getActualClass();\n\t// for (Field f : RtHelper.getAllFields(c)) {\n\t// if (!getSimpleName().equals(f.getName())) {\n\t// continue;\n\t// }\n\t// f.setAccessible(true);\n\t// return f.getAnnotations();\n\t// }\n\t// // If the fields belong to an annotation type, they are actually\n\t// // methods\n\t// for (Method m : RtHelper.getAllMethods(c)) {\n\t// if (!getSimpleName().equals(m.getName())) {\n\t// continue;\n\t// }\n\t// m.setAccessible(true);\n\t// return m.getAnnotations();\n\t// }\n\t// return null;\n\t// }\n\n\t@Override\n\t@SuppressWarnings("unchecked")\n\tpublic CtField<T> getDeclaration() {\n\t\treturn fromDeclaringType();\n\t}\n\n\tprivate CtField<T> fromDeclaringType() {\n\t\tif (declaringType == null) {\n\t\t\treturn null;\n\t\t}\n\t\tCtType<?> type = declaringType.getDeclaration();\n\t\tif (type != null) {\n\t\t\treturn (CtField<T>) type.getField(getSimpleName());\n\t\t}\n\t\treturn null;\n\t}\n\n\t@Override\n\tpublic CtField<T> getFieldDeclaration() {\n\t\tif (declaringType == null) {\n\t\t\treturn null;\n\t\t}\n\t\tCtType<?> type = declaringType.getTypeDeclaration();\n\t\tif (type != null) {\n\t\t\tfinal CtField<T> ctField = (CtField<T>) type.getField(getSimpleName());\n\t\t\tif (ctField == null && type instanceof CtEnum) {\n\t\t\t\treturn ((CtEnum) type).getEnumValue(getSimpleName());\n\t\t\t}\n\t\t\treturn ctField;\n\t\t}\n\t\treturn null;\n\t}\n\n\t@Override\n\tpublic CtTypeReference<?> getDeclaringType() {\n\t\treturn declaringType;\n\t}\n\n\t@Override\n\tpublic String getQualifiedName() {\n\t\tCtTypeReference<?> declaringType = getDeclaringType();\n\n\t\tif (declaringType != null) {\n\t\t\treturn getDeclaringType().getQualifiedName() + "#" + getSimpleName();\n\t\t} else {\n\t\t\treturn  "<unknown>#" + getSimpleName();\n\t\t}\n\t}\n\n\t@Override\n\tpublic boolean isFinal() {\n\t\treturn fina;\n\t}\n\n\t/**\n\t * Tells if the referenced field is static.\n\t */\n\t@Override\n\tpublic boolean isStatic() {\n\t\treturn stat;\n\t}\n\n\t@Override\n\tpublic <C extends CtFieldReference<T>> C setDeclaringType(CtTypeReference<?> declaringType) {\n\t\tif (declaringType != null) {\n\t\t\tdeclaringType.setParent(this);\n\t\t}\n\t\tgetFactory().getEnvironment().getModelChangeListener().onObjectUpdate(this, DECLARING_TYPE, declaringType, this.declaringType);\n\t\tthis.declaringType = declaringType;\n\t\treturn (C) this;\n\t}\n\n\t@Override\n\tpublic <C extends CtFieldReference<T>> C setFinal(boolean fina) {\n\t\tgetFactory().getEnvironment().getModelChangeListener().onObjectUpdate(this, IS_FINAL, fina, this.fina);\n\t\tthis.fina = fina;\n\t\treturn (C) this;\n\t}\n\n\t@Override\n\tpublic <C extends CtFieldReference<T>> C setStatic(boolean stat) {\n\t\tgetFactory().getEnvironment().getModelChangeListener().onObjectUpdate(this, IS_STATIC, stat, this.stat);\n\t\tthis.stat = stat;\n\t\treturn (C) this;\n\t}\n\n\t@Override\n\tpublic Set<ModifierKind> getModifiers() {\n\t\tCtVariable<?> v = getDeclaration();\n\t\tif (v != null) {\n\t\t\treturn v.getModifiers();\n\t\t}\n\t\tMember m = getActualField();\n\t\tif (m != null) {\n\t\t\treturn RtHelper.getModifiers(m.getModifiers());\n\t\t}\n\t\treturn Collections.emptySet();\n\t}\n\n\t@Override\n\tpublic CtFieldReference<T> clone() {\n\t\treturn (CtFieldReference<T>) super.clone();\n\t}\n}\n`;

const bfcOldCode = `/**\n * Copyright (C) 2006-2018 INRIA and contributors\n * Spoon - http://spoon.gforge.inria.fr/\n *\n * This software is governed by the CeCILL-C License under French law and\n * abiding by the rules of distribution of free software. You can use, modify\n * and/or redistribute the software under the terms of the CeCILL-C license as\n * circulated by CEA, CNRS and INRIA at http://www.cecill.info.\n *\n * This program is distributed in the hope that it will be useful, but WITHOUT\n * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or\n * FITNESS FOR A PARTICULAR PURPOSE. See the CeCILL-C License for more details.\n *\n * The fact that you are presently reading this means that you have had\n * knowledge of the CeCILL-C license and that you accept its terms.\n */\npackage spoon.support.reflect.reference;\n\nimport spoon.Launcher;\nimport spoon.SpoonException;\nimport spoon.reflect.annotations.MetamodelPropertyField;\nimport spoon.reflect.declaration.CtEnum;\nimport spoon.reflect.declaration.CtField;\nimport spoon.reflect.declaration.CtType;\nimport spoon.reflect.declaration.CtVariable;\nimport spoon.reflect.declaration.ModifierKind;\nimport spoon.reflect.reference.CtFieldReference;\nimport spoon.reflect.reference.CtTypeReference;\nimport spoon.reflect.visitor.CtVisitor;\nimport spoon.support.SpoonClassNotFoundException;\nimport spoon.support.util.RtHelper;\n\nimport java.lang.reflect.AnnotatedElement;\nimport java.lang.reflect.Member;\nimport java.util.Collections;\nimport java.util.Set;\n\nimport static spoon.reflect.path.CtRole.DECLARING_TYPE;\nimport static spoon.reflect.path.CtRole.IS_FINAL;\nimport static spoon.reflect.path.CtRole.IS_STATIC;\n\npublic class CtFieldReferenceImpl<T> extends CtVariableReferenceImpl<T> implements CtFieldReference<T> {\n\tprivate static final long serialVersionUID = 1L;\n\n\t@MetamodelPropertyField(role = DECLARING_TYPE)\n\tCtTypeReference<?> declaringType;\n\n\t@MetamodelPropertyField(role = IS_FINAL)\n\tboolean fina = false;\n\n\t@MetamodelPropertyField(role = IS_STATIC)\n\tboolean stat = false;\n\n\tpublic CtFieldReferenceImpl() {\n\t}\n\n\t@Override\n\tpublic void accept(CtVisitor visitor) {\n\t\tvisitor.visitCtFieldReference(this);\n\t}\n\n\t@Override\n\tpublic Member getActualField() {\n\t\tCtTypeReference<?> typeRef = getDeclaringType();\n\t\tif (typeRef == null) {\n\t\t\tthrow new SpoonException("Declaring type of field " + getSimpleName() + " isn\'t defined");\n\t\t}\n\t\tClass<?> clazz;\n\t\ttry {\n\t\t\tclazz = typeRef.getActualClass();\n\t\t} catch (SpoonClassNotFoundException e) {\n\t\t\tif (getFactory().getEnvironment().getNoClasspath()) {\n\t\t\t\tLauncher.LOGGER.info("The class " + typeRef.getQualifiedName() + " of field " + getSimpleName() + " is not on class path. Problem ignored in noclasspath mode");\n\t\t\t\treturn null;\n\t\t\t}\n\t\t\tthrow e;\n\t\t}\n\t\ttry {\n\t\t\tif (clazz.isAnnotation()) {\n\t\t\t\treturn clazz.getDeclaredMethod(getSimpleName());\n\t\t\t} else {\n\t\t\t\treturn clazz.getDeclaredField(getSimpleName());\n\t\t\t}\n\t\t} catch (NoSuchMethodException | NoSuchFieldException e) {\n\t\t\tthrow new SpoonException("The field " + getQualifiedName() + " not found", e);\n\t\t}\n\t}\n\n\t@Override\n\tprotected AnnotatedElement getActualAnnotatedElement() {\n\t\treturn (AnnotatedElement) getActualField();\n\t}\n\n\t// @Override\n\t// public <A extends Annotation> A getAnnotation(Class<A> annotationType) {\n\t// A annotation = super.getAnnotation(annotationType);\n\t// if (annotation != null) {\n\t// return annotation;\n\t// }\n\t// // use reflection\n\t// Class<?> c = getDeclaringType().getActualClass();\n\t// if (c.isAnnotation()) {\n\t// for (Method m : RtHelper.getAllMethods(c)) {\n\t// if (!getSimpleName().equals(m.getName())) {\n\t// continue;\n\t// }\n\t// m.setAccessible(true);\n\t// return m.getAnnotation(annotationType);\n\t// }\n\t// } else {\n\t// for (Field f : RtHelper.getAllFields(c)) {\n\t// if (!getSimpleName().equals(f.getName())) {\n\t// continue;\n\t// }\n\t// f.setAccessible(true);\n\t// return f.getAnnotation(annotationType);\n\t// }\n\t// }\n\t// return null;\n\t// }\n\n\t// @Override\n\t// public Annotation[] getAnnotations() {\n\t// Annotation[] annotations = super.getAnnotations();\n\t// if (annotations != null) {\n\t// return annotations;\n\t// }\n\t// // use reflection\n\t// Class<?> c = getDeclaringType().getActualClass();\n\t// for (Field f : RtHelper.getAllFields(c)) {\n\t// if (!getSimpleName().equals(f.getName())) {\n\t// continue;\n\t// }\n\t// f.setAccessible(true);\n\t// return f.getAnnotations();\n\t// }\n\t// // If the fields belong to an annotation type, they are actually\n\t// // methods\n\t// for (Method m : RtHelper.getAllMethods(c)) {\n\t// if (!getSimpleName().equals(m.getName())) {\n\t// continue;\n\t// }\n\t// m.setAccessible(true);\n\t// return m.getAnnotations();\n\t// }\n\t// return null;\n\t// }\n\n\t@Override\n\t@SuppressWarnings("unchecked")\n\tpublic CtField<T> getDeclaration() {\n\t\treturn fromDeclaringType();\n\t}\n\n\tprivate CtField<T> fromDeclaringType() {\n\t\tif (declaringType == null) {\n\t\t\treturn null;\n\t\t}\n\t\tCtType<?> type = declaringType.getDeclaration();\n\t\tif (type != null) {\n\t\t\treturn (CtField<T>) type.getField(getSimpleName());\n\t\t}\n\t\treturn null;\n\t}\n\n\t@Override\n\tpublic CtField<T> getFieldDeclaration() {\n\t\tif (declaringType == null) {\n\t\t\treturn null;\n\t\t}\n\t\tCtType<?> type = declaringType.getTypeDeclaration();\n\t\tif (type != null) {\n\t\t\tfinal CtField<T> ctField = (CtField<T>) type.getField(getSimpleName());\n\t\t\tif (ctField == null && type instanceof CtEnum) {\n\t\t\t\treturn ((CtEnum) type).getEnumValue(getSimpleName());\n\t\t\t}\n\t\t\treturn ctField;\n\t\t}\n\t\treturn null;\n\t}\n\n\t@Override\n\tpublic CtTypeReference<?> getDeclaringType() {\n\t\treturn declaringType;\n\t}\n\n\t@Override\n\tpublic String getQualifiedName() {\n\t\tCtTypeReference<?> declaringType = getDeclaringType();\n\n\t\tif (declaringType != null) {\n\t\t\treturn getDeclaringType().getQualifiedName() + "#" + getSimpleName();\n\t\t} else {\n\t\t\treturn  "<unknown>#" + getSimpleName();\n\t\t}\n\t}\n\n\t@Override\n\tpublic boolean isFinal() {\n\t\treturn fina;\n\t}\n\n\t/**\n\t * Tells if the referenced field is static.\n\t */\n\t@Override\n\tpublic boolean isStatic() {\n\t\treturn stat;\n\t}\n\n\t@Override\n\tpublic <C extends CtFieldReference<T>> C setDeclaringType(CtTypeReference<?> declaringType) {\n\t\tif (declaringType != null) {\n\t\t\tdeclaringType.setParent(this);\n\t\t}\n\t\tgetFactory().getEnvironment().getModelChangeListener().onObjectUpdate(this, DECLARING_TYPE, declaringType, this.declaringType);\n\t\tthis.declaringType = declaringType;\n\t\treturn (C) this;\n\t}\n\n\t@Override\n\tpublic <C extends CtFieldReference<T>> C setFinal(boolean fina) {\n\t\tgetFactory().getEnvironment().getModelChangeListener().onObjectUpdate(this, IS_FINAL, fina, this.fina);\n\t\tthis.fina = fina;\n\t\treturn (C) this;\n\t}\n\n\t@Override\n\tpublic <C extends CtFieldReference<T>> C setStatic(boolean stat) {\n\t\tgetFactory().getEnvironment().getModelChangeListener().onObjectUpdate(this, IS_STATIC, stat, this.stat);\n\t\tthis.stat = stat;\n\t\treturn (C) this;\n\t}\n\n\t@Override\n\tpublic Set<ModifierKind> getModifiers() {\n\t\tCtVariable<?> v = getDeclaration();\n\t\tif (v != null) {\n\t\t\treturn v.getModifiers();\n\t\t}\n\t\tMember m = getActualField();\n\t\tif (m != null) {\n\t\t\treturn RtHelper.getModifiers(m.getModifiers());\n\t\t}\n\t\treturn Collections.emptySet();\n\t}\n\n\t@Override\n\tpublic CtFieldReference<T> clone() {\n\t\treturn (CtFieldReference<T>) super.clone();\n\t}\n}\n`;
const bfcNewCode = `/**\n * Copyright (C) 2006-2018 INRIA and contributors\n * Spoon - http://spoon.gforge.inria.fr/\n *\n * This software is governed by the CeCILL-C License under French law and\n * abiding by the rules of distribution of free software. You can use, modify\n * and/or redistribute the software under the terms of the CeCILL-C license as\n * circulated by CEA, CNRS and INRIA at http://www.cecill.info.\n *\n * This program is distributed in the hope that it will be useful, but WITHOUT\n * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or\n * FITNESS FOR A PARTICULAR PURPOSE. See the CeCILL-C License for more details.\n *\n * The fact that you are presently reading this means that you have had\n * knowledge of the CeCILL-C license and that you accept its terms.\n */\npackage spoon.support.reflect.reference;\n\nimport spoon.Launcher;\nimport spoon.SpoonException;\nimport spoon.reflect.annotations.MetamodelPropertyField;\nimport spoon.reflect.code.CtFieldAccess;\nimport spoon.reflect.code.CtTypeAccess;\nimport spoon.reflect.declaration.CtEnum;\nimport spoon.reflect.declaration.CtField;\nimport spoon.reflect.declaration.CtType;\nimport spoon.reflect.declaration.CtVariable;\nimport spoon.reflect.declaration.ModifierKind;\nimport spoon.reflect.reference.CtFieldReference;\nimport spoon.reflect.reference.CtTypeReference;\nimport spoon.reflect.visitor.CtVisitor;\nimport spoon.support.SpoonClassNotFoundException;\nimport spoon.support.util.RtHelper;\n\nimport java.lang.reflect.AnnotatedElement;\nimport java.lang.reflect.Member;\nimport java.util.Collections;\nimport java.util.Set;\n\nimport static spoon.reflect.path.CtRole.DECLARING_TYPE;\nimport static spoon.reflect.path.CtRole.IS_FINAL;\nimport static spoon.reflect.path.CtRole.IS_STATIC;\n\npublic class CtFieldReferenceImpl<T> extends CtVariableReferenceImpl<T> implements CtFieldReference<T> {\n\tprivate static final long serialVersionUID = 1L;\n\n\t@MetamodelPropertyField(role = DECLARING_TYPE)\n\tCtTypeReference<?> declaringType;\n\n\t@MetamodelPropertyField(role = IS_FINAL)\n\tboolean fina = false;\n\n\t@MetamodelPropertyField(role = IS_STATIC)\n\tboolean stat = false;\n\n\tpublic CtFieldReferenceImpl() {\n\t}\n\n\t@Override\n\tpublic void accept(CtVisitor visitor) {\n\t\tvisitor.visitCtFieldReference(this);\n\t}\n\n\t@Override\n\tpublic Member getActualField() {\n\t\tCtTypeReference<?> typeRef = getDeclaringType();\n\t\tif (typeRef == null) {\n\t\t\tthrow new SpoonException("Declaring type of field " + getSimpleName() + " isn\'t defined");\n\t\t}\n\t\tClass<?> clazz;\n\t\ttry {\n\t\t\tclazz = typeRef.getActualClass();\n\t\t} catch (SpoonClassNotFoundException e) {\n\t\t\tif (getFactory().getEnvironment().getNoClasspath()) {\n\t\t\t\tLauncher.LOGGER.info("The class " + typeRef.getQualifiedName() + " of field " + getSimpleName() + " is not on class path. Problem ignored in noclasspath mode");\n\t\t\t\treturn null;\n\t\t\t}\n\t\t\tthrow e;\n\t\t}\n\t\ttry {\n\t\t\tif (clazz.isAnnotation()) {\n\t\t\t\treturn clazz.getDeclaredMethod(getSimpleName());\n\t\t\t} else {\n\t\t\t\treturn clazz.getDeclaredField(getSimpleName());\n\t\t\t}\n\t\t} catch (NoSuchMethodException | NoSuchFieldException e) {\n\t\t\tthrow new SpoonException("The field " + getQualifiedName() + " not found", e);\n\t\t}\n\t}\n\n\t@Override\n\tprotected AnnotatedElement getActualAnnotatedElement() {\n\t\treturn (AnnotatedElement) getActualField();\n\t}\n\n\t// @Override\n\t// public <A extends Annotation> A getAnnotation(Class<A> annotationType) {\n\t// A annotation = super.getAnnotation(annotationType);\n\t// if (annotation != null) {\n\t// return annotation;\n\t// }\n\t// // use reflection\n\t// Class<?> c = getDeclaringType().getActualClass();\n\t// if (c.isAnnotation()) {\n\t// for (Method m : RtHelper.getAllMethods(c)) {\n\t// if (!getSimpleName().equals(m.getName())) {\n\t// continue;\n\t// }\n\t// m.setAccessible(true);\n\t// return m.getAnnotation(annotationType);\n\t// }\n\t// } else {\n\t// for (Field f : RtHelper.getAllFields(c)) {\n\t// if (!getSimpleName().equals(f.getName())) {\n\t// continue;\n\t// }\n\t// f.setAccessible(true);\n\t// return f.getAnnotation(annotationType);\n\t// }\n\t// }\n\t// return null;\n\t// }\n\n\t// @Override\n\t// public Annotation[] getAnnotations() {\n\t// Annotation[] annotations = super.getAnnotations();\n\t// if (annotations != null) {\n\t// return annotations;\n\t// }\n\t// // use reflection\n\t// Class<?> c = getDeclaringType().getActualClass();\n\t// for (Field f : RtHelper.getAllFields(c)) {\n\t// if (!getSimpleName().equals(f.getName())) {\n\t// continue;\n\t// }\n\t// f.setAccessible(true);\n\t// return f.getAnnotations();\n\t// }\n\t// // If the fields belong to an annotation type, they are actually\n\t// // methods\n\t// for (Method m : RtHelper.getAllMethods(c)) {\n\t// if (!getSimpleName().equals(m.getName())) {\n\t// continue;\n\t// }\n\t// m.setAccessible(true);\n\t// return m.getAnnotations();\n\t// }\n\t// return null;\n\t// }\n\n\t@Override\n\t@SuppressWarnings("unchecked")\n\tpublic CtField<T> getDeclaration() {\n\t\treturn fromDeclaringType();\n\t}\n\n\tprivate CtField<T> fromDeclaringType() {\n\t\tif (declaringType == null) {\n\t\t\treturn null;\n\t\t}\n\t\tCtType<?> type = declaringType.getDeclaration();\n\t\tif (type != null) {\n\t\t\treturn (CtField<T>) type.getField(getSimpleName());\n\t\t}\n\t\treturn null;\n\t}\n\n\t@Override\n\tpublic CtField<T> getFieldDeclaration() {\n\t\tif (declaringType == null) {\n\t\t\treturn null;\n\t\t}\n\t\tCtType<?> type = declaringType.getTypeDeclaration();\n\t\tif (type != null) {\n\t\t\tfinal CtField<T> ctField = (CtField<T>) type.getField(getSimpleName());\n\t\t\tif (ctField == null && type instanceof CtEnum) {\n\t\t\t\treturn ((CtEnum) type).getEnumValue(getSimpleName());\n\t\t\t}\n\t\t\treturn ctField;\n\t\t}\n\t\treturn null;\n\t}\n\n\t@Override\n\tpublic CtTypeReference<?> getDeclaringType() {\n\t\treturn declaringType;\n\t}\n\n\t@Override\n\tpublic String getQualifiedName() {\n\t\tCtTypeReference<?> declaringType = getDeclaringType();\n\n\t\tif (declaringType != null) {\n\t\t\treturn getDeclaringType().getQualifiedName() + "#" + getSimpleName();\n\t\t} else {\n\t\t\treturn  "<unknown>#" + getSimpleName();\n\t\t}\n\t}\n\n\t@Override\n\tpublic boolean isFinal() {\n\t\treturn fina;\n\t}\n\n\t/**\n\t * Tells if the referenced field is static.\n\t */\n\t@Override\n\tpublic boolean isStatic() {\n\t\treturn stat;\n\t}\n\n\t@Override\n\tpublic <C extends CtFieldReference<T>> C setDeclaringType(CtTypeReference<?> declaringType) {\n\t\tif (declaringType != null) {\n\t\t\tdeclaringType.setParent(this);\n\t\t}\n\t\tgetFactory().getEnvironment().getModelChangeListener().onObjectUpdate(this, DECLARING_TYPE, declaringType, this.declaringType);\n\t\tthis.declaringType = declaringType;\n\t\treturn (C) this;\n\t}\n\n\t@Override\n\tpublic <C extends CtFieldReference<T>> C setFinal(boolean fina) {\n\t\tgetFactory().getEnvironment().getModelChangeListener().onObjectUpdate(this, IS_FINAL, fina, this.fina);\n\t\tthis.fina = fina;\n\t\treturn (C) this;\n\t}\n\n\t@Override\n\tpublic <C extends CtFieldReference<T>> C setStatic(boolean stat) {\n\t\tgetFactory().getEnvironment().getModelChangeListener().onObjectUpdate(this, IS_STATIC, stat, this.stat);\n\t\tthis.stat = stat;\n\t\treturn (C) this;\n\t}\n\n\t@Override\n\tpublic Set<ModifierKind> getModifiers() {\n\t\tCtVariable<?> v = getDeclaration();\n\t\tif (v != null) {\n\t\t\treturn v.getModifiers();\n\t\t}\n\t\t// the modifiers of the "class" of AClass.class is the empty set\n\t\tif (this.isParentInitialized()\n\t\t\t\t&& this.getParent() instanceof CtFieldAccess\n\t\t\t\t&& ((CtFieldAccess) this.getParent()).getTarget() instanceof CtTypeAccess) {\n\t\t\treturn emptySet();\n\t\t}\n\t\tMember m = getActualField();\n\t\tif (m != null) {\n\t\t\treturn RtHelper.getModifiers(m.getModifiers());\n\t\t}\n\t\treturn Collections.emptySet();\n\t}\n\n\t@Override\n\tpublic CtFieldReference<T> clone() {\n\t\treturn (CtFieldReference<T>) super.clone();\n\t}\n}\n`;

const javaCode = `public class CtFieldReferenceImpl<T> extends CtVariableReferenceImpl<T> implements CtFieldReference<T> {\n\tprivate static final long serialVersionUID = 1L;\n\n\t@MetamodelPropertyField(role = DECLARING_TYPE)\n\tCtTypeReference<?> declaringType;\n\n\t@MetamodelPropertyField(role = IS_FINAL)\n\tboolean fina = false;\n\n\t@MetamodelPropertyField(role = IS_STATIC)\n\tboolean stat = false;\n\n\tpublic CtFieldReferenceImpl() {\n\t}\n\n\t@Override\n\tpublic void accept(CtVisitor visitor) {\n\t\tvisitor.visitCtFieldReference(this);\n\t}\n\n\t@Override\n\tpublic Member getActualField() {\n\t\ttry {\n\t\t\tif (getDeclaringType().getActualClass().isAnnotation()) {\n\t\t\t\treturn getDeclaringType().getActualClass().getDeclaredMethod(\n\t\t\t\t\t\tgetSimpleName());\n\t\t\t}\n\t\t\treturn getDeclaringType().getActualClass().getDeclaredField(\n\t\t\t\t\tgetSimpleName());\n\t\t} catch (Exception e) {\n\t\t\tLauncher.LOGGER.error(e.getMessage(), e);\n\t\t}\n\t\treturn null;\n\t}\n\n\t@Override\n\tprotected AnnotatedElement getActualAnnotatedElement() {\n\t\treturn (AnnotatedElement) getActualField();\n\t}\n\n\t// @Override\n\t// public <A extends Annotation> A getAnnotation(Class<A> annotationType) {\n\t// A annotation = super.getAnnotation(annotationType);\n\t// if (annotation != null) {\n\t// return annotation;\n\t// }\n\t// // use reflection\n\t// Class<?> c = getDeclaringType().getActualClass();\n\t// if (c.isAnnotation()) {\n\t// for (Method m : RtHelper.getAllMethods(c)) {\n\t// if (!getSimpleName().equals(m.getName())) {\n\t// continue;\n\t// }\n\t// m.setAccessible(true);\n\t// return m.getAnnotation(annotationType);\n\t// }\n\t// } else {\n\t// for (Field f : RtHelper.getAllFields(c)) {\n\t// if (!getSimpleName().equals(f.getName())) {\n\t// continue;\n\t// }\n\t// f.setAccessible(true);\n\t// return f.getAnnotation(annotationType);\n\t// }\n\t// }\n\t// return null;\n\t// }\n\n\t// @Override\n\t// public Annotation[] getAnnotations() {\n\t// Annotation[] annotations = super.getAnnotations();\n\t// if (annotations != null) {\n\t// return annotations;\n\t// }\n\t// // use reflection\n\t// Class<?> c = getDeclaringType().getActualClass();\n\t// for (Field f : RtHelper.getAllFields(c)) {\n\t// if (!getSimpleName().equals(f.getName())) {\n\t// continue;\n\t// }\n\t// f.setAccessible(true);\n\t// return f.getAnnotations();\n\t// }\n\t// // If the fields belong to an annotation type, they are actually\n\t// // methods\n\t// for (Method m : RtHelper.getAllMethods(c)) {\n\t// if (!getSimpleName().equals(m.getName())) {\n\t// continue;\n\t// }\n\t// m.setAccessible(true);\n\t// return m.getAnnotations();\n\t// }\n\t// return null;\n\t// }\n\n\t@Override\n\t@SuppressWarnings("unchecked")\n\tpublic CtField<T> getDeclaration() {\n\t\treturn fromDeclaringType();\n\t}\n\n\tprivate CtField<T> fromDeclaringType() {\n\t\tif (declaringType == null) {\n\t\t\treturn null;\n\t\t}\n\t\tCtType<?> type = declaringType.getDeclaration();\n\t\tif (type != null) {\n\t\t\treturn (CtField<T>) type.getField(getSimpleName());\n\t\t}\n\t\treturn null;\n\t}\n\n\t@Override\n\tpublic CtField<T> getFieldDeclaration() {\n\t\tif (declaringType == null) {\n\t\t\treturn null;\n\t\t}\n\t\tCtType<?> type = declaringType.getTypeDeclaration();\n\t\tif (type != null) {\n\t\t\tfinal CtField<T> ctField = (CtField<T>) type.getField(getSimpleName());\n\t\t\tif (ctField == null && type instanceof CtEnum) {\n\t\t\t\treturn ((CtEnum) type).getEnumValue(getSimpleName());\n\t\t\t}\n\t\t\treturn ctField;\n\t\t}\n\t\treturn null;\n\t}\n\n\t@Override\n\tpublic CtTypeReference<?> getDeclaringType() {\n\t\treturn declaringType;\n\t}\n\n\t@Override\n\tpublic String getQualifiedName() {\n\t\tCtTypeReference<?> declaringType = getDeclaringType();\n\n\t\tif (declaringType != null) {\n\t\t\treturn getDeclaringType().getQualifiedName() + "#" + getSimpleName();\n\t\t} else {\n\t\t\treturn  "<unknown>#" + getSimpleName();\n\t\t}\n\t}\n\n\t@Override\n\tpublic boolean isFinal() {\n\t\treturn fina;\n\t}\n\n\t/**\n\t * Tells if the referenced field is static.\n\t */\n\t@Override\n\tpublic boolean isStatic() {\n\t\treturn stat;\n\t}\n\n\t@Override\n\tpublic <C extends CtFieldReference<T>> C setDeclaringType(CtTypeReference<?> declaringType) {\n\t\tif (declaringType != null) {\n\t\t\tdeclaringType.setParent(this);\n\t\t}\n\t\tgetFactory().getEnvironment().getModelChangeListener().onObjectUpdate(this, DECLARING_TYPE, declaringType, this.declaringType);\n\t\tthis.declaringType = declaringType;\n\t\treturn (C) this;\n\t}\n\n\t@Override\n\tpublic <C extends CtFieldReference<T>> C setFinal(boolean fina) {\n\t\tgetFactory().getEnvironment().getModelChangeListener().onObjectUpdate(this, IS_FINAL, fina, this.fina);\n\t\tthis.fina = fina;\n\t\treturn (C) this;\n\t}\n\n\t@Override\n\tpublic <C extends CtFieldReference<T>> C setStatic(boolean stat) {\n\t\tgetFactory().getEnvironment().getModelChangeListener().onObjectUpdate(this, IS_STATIC, stat, this.stat);\n\t\tthis.stat = stat;\n\t\treturn (C) this;\n\t}\n\n\t@Override\n\tpublic Set<ModifierKind> getModifiers() {\n\t\tCtVariable<?> v = getDeclaration();\n\t\tif (v != null) {\n\t\t\treturn v.getModifiers();\n\t\t}\n\t\tMember m = getActualField();\n\t\tif (m != null) {\n\t\t\treturn RtHelper.getModifiers(m.getModifiers());\n\t\t}\n\t\treturn Collections.emptySet();\n\t}\n\n\t@Override\n\tpublic CtFieldReference<T> clone() {\n\t\treturn (CtFieldReference<T>) super.clone();\n\t}\n}\n`;

const tsxCode = `const normalizeId = (value) => (value.indexOf('#') === 0 ? value.slice(1) : value);\nconst isEl = (value) => typeof value === 'object' && value.nodeType === 1;\nconst fs = require("fs");\nconst CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");\nconst InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin");\nconst InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");\nconst getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");\nconst ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");\nconst ModuleNotFoundPlugin = require("react-dev-utils/ModuleNotFoundPlugin");\nconst ForkTsCheckerWebpackPlugin =\n  process.env.TSC_COMPILE_ON_ERROR === "true"\n    ? require("react-dev-utils/ForkTsCheckerWarningWebpackPlugin")\n    : require("react-dev-utils/ForkTsCheckerWebpackPlugin");\nconst ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");\n`;

const MonacoEditorPage: React.FC<IProps> = () => {
  //   const [code, setCode] = useState<string>();

  useEffect(() => {}, []);

  return (
    <>
      <div
        className="monaco-editor-window"
        style={{
          borderStyle: "double",
          borderColor: "blue",
          borderWidth: "20px",
        }}
      >
        <h3>Monaco Editor</h3>
        <MonacoEditor
          className="editor-1"
          width="1800px"
          height="880px"
          language="java"
          theme="vs"
          value={javaCode}
        />
        <p
          style={{
            borderTop: "double",
            borderColor: "blue",
            borderWidth: "20px",
          }}
        />
        <MonacoEditor
          className="editor-2"
          width="1800px"
          height="100px"
          language="typescript"
          theme="vs"
          value={tsxCode}
        />
      </div>
      <div
        className="monaco-diff-editor-window"
        style={{
          borderStyle: "double",
          borderColor: "green",
          borderWidth: "20px",
        }}
      >
        <h3>Monaco Diff Editor</h3>
        <MonacoDiffEditor
          className="diff-editor-1"
          width="1800px"
          height="880px"
          language="java"
          theme="vs"
          original={bicOldCode}
          value={bicNewCode}
          options={{ renderSideBySide: false, fontSize: 20 }}
        />
      </div>
      <div
        className="monaco-editor-window-else"
        style={{
          borderStyle: "double",
          borderColor: "red",
          borderWidth: "20px",
        }}
      >
        <h3>Monaco Editor TSX</h3>
        <MonacoDiffEditor
          className="diff-editor-2"
          width="1800px"
          height="880px"
          language="java"
          theme="vs"
        />
      </div>
    </>
  );
};

export default MonacoEditorPage;
