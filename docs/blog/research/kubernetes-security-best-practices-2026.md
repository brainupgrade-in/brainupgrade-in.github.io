# Kubernetes Security Best Practices 2026: Comprehensive Guide

**Author:** Research Agent (Gheware DevOps AI)
**Date:** 2026-01-11
**Last Updated:** 2026-01-11
**Target Content:** Blog Post -> Video

---

### Freshness Metadata

| Metric | Value |
|--------|-------|
| **Research Date** | 2026-01-11 |
| **Sources Date Range** | 2024-06 to 2026-01 |
| **Software Versions** | Kubernetes 1.34/1.35, Falco 0.42.0, Trivy latest, Sigstore/Cosign latest |
| **Freshness Rating** | Current |

> **Freshness Rating Scale:**
> - **Current** - All sources <6 months old, versions verified
> - **Recent** - Some sources 6-12 months old, may need review
> - **Review Needed** - Sources >12 months old, verify before publishing

---

## Executive Summary

Kubernetes security in 2026 represents a mature, multi-layered discipline requiring defense-in-depth strategies across the entire container lifecycle. This research covers eight critical security domains: Pod Security Standards (PSS), Network Policies, RBAC, Secrets Management, Image Security, Runtime Security, Cluster Hardening, and Supply Chain Security.

Key findings include: Pod Security Standards have fully replaced deprecated Pod Security Policies since Kubernetes 1.25, with the "Restricted" profile becoming the production standard. Network Policies now emphasize default-deny approaches with CNI plugins like Cilium offering advanced eBPF-based security. RBAC best practices center on least-privilege principles with separate service accounts per workload. Secrets management has evolved toward External Secrets Operator and HashiCorp Vault integration with dynamic, short-lived credentials. Admission controllers (Kyverno and OPA Gatekeeper) enforce image security policies, while Falco provides runtime threat detection. CIS Benchmarks with kube-bench automate compliance checking, and Sigstore/Cosign enable software supply chain security with keyless signing.

The Certified Kubernetes Security Specialist (CKS) exam covers these domains with emphasis on Supply Chain Security (20%), Microservice Vulnerabilities (20%), and Runtime Security (20%).

---

## Table of Contents

1. [Pod Security](#1-pod-security)
2. [Network Security](#2-network-security)
3. [RBAC and Access Control](#3-rbac-and-access-control)
4. [Secrets Management](#4-secrets-management)
5. [Image Security](#5-image-security)
6. [Runtime Security](#6-runtime-security)
7. [Cluster Hardening](#7-cluster-hardening)
8. [Supply Chain Security](#8-supply-chain-security)
9. [Security Tools Comparison](#9-security-tools-comparison)
10. [CKS Certification Alignment](#10-cks-certification-alignment)

---

## VIDEO PIPELINE SECTIONS

### Video Content Hooks

1. **Hook 1:** "Kubernetes Secrets are NOT encrypted by default - they're just Base64 encoded. Anyone with etcd access can read them in plaintext." - Kubernetes Documentation
2. **Hook 2:** "In September 2025, the GhostAction supply chain attack compromised 817 repositories and exfiltrated 3,325 secrets including Docker Hub tokens." - GitGuardian
3. **Hook 3:** "Falco can detect container escapes, cryptomining, and privilege escalation in real-time using eBPF - all before traditional scanners even notice." - CNCF
4. **Hook 4:** "The default Kubernetes service account is automatically mounted to every pod - and most pods don't even need API access." - Kubernetes RBAC Best Practices
5. **Hook 5:** "CKS exam requires 67% to pass with only 2 hours - and Trivy image scanning is almost guaranteed to appear." - Linux Foundation

### Key Quotable Statements (AEO Optimized)

1. "Pod Security Standards define three levels - Privileged, Baseline, and Restricted - replacing the deprecated Pod Security Policies since Kubernetes 1.25."
2. "Network Policies should start with default-deny-all and explicitly allow only required traffic flows using labels instead of IP addresses."
3. "Every Kubernetes workload should use a dedicated service account with only the minimum permissions required - never use the default service account."
4. "External Secrets Operator synchronizes secrets from AWS Secrets Manager, HashiCorp Vault, or Azure Key Vault into native Kubernetes Secrets automatically."
5. "Kyverno uses YAML for policy definitions while OPA Gatekeeper requires learning Rego - making Kyverno more accessible for Kubernetes-native teams."
6. "Falco monitors Linux system calls using eBPF and alerts on suspicious runtime behavior like shell spawns, file access, and network connections."
7. "CIS Kubernetes Benchmarks provide two security levels: L1 for essential requirements and L2 for defense-in-depth hardening."
8. "Sigstore provides keyless signing using OIDC identities - eliminating the complexity of traditional PKI for container image verification."
9. "KMS v2 encryption uses envelope encryption where data encryption keys (DEKs) are protected by key encryption keys (KEKs) stored in external KMS."
10. "Service mesh solutions like Linkerd provide automatic mTLS with zero configuration, while Istio offers more comprehensive but complex security controls."

### Visual/Diagram Opportunities

| Concept | Visual Type | Description |
|---------|-------------|-------------|
| Pod Security Standards | Comparison Table | Three-level pyramid showing Privileged -> Baseline -> Restricted with specific controls |
| Defense in Depth | Architecture Diagram | Layered security showing Image -> Admission -> Runtime -> Network -> Secrets |
| RBAC Model | Flow Chart | Subject (User/ServiceAccount) -> RoleBinding -> Role -> Resources/Verbs |
| Network Policy | Before/After | Default allow-all vs default-deny with specific allow rules |
| Supply Chain Security | Pipeline Diagram | Build -> Sign -> Store -> Verify -> Deploy with Sigstore integration |
| CKS Exam Domains | Pie Chart | Six domains with weightage percentages |

### Certification Alignment

**Exam:** CKS (Certified Kubernetes Security Specialist)
**Prerequisite:** CKA (Certified Kubernetes Administrator)

**Exam Domains Covered:**
- [x] Cluster Setup (10%) - API server security, TLS, etcd encryption
- [x] Cluster Hardening (15%) - RBAC, service accounts, CIS benchmarks
- [x] System Hardening (15%) - Host OS, kernel parameters
- [x] Minimize Microservice Vulnerabilities (20%) - PSS, SecurityContext, Network Policies
- [x] Supply Chain Security (20%) - Image scanning, signing, admission controllers
- [x] Monitoring, Logging, and Runtime Security (20%) - Falco, audit logs

**Official Exam Resources:**
- [CKS Exam Page](https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/)
- [Kubernetes Security Documentation](https://kubernetes.io/docs/concepts/security/)

---

## BLOG POST HANDOFF

### Suggested Blog Title

**Primary:** Kubernetes Security Best Practices 2026: Complete Production Hardening Guide
**Alternative 1:** 8 Essential Kubernetes Security Domains Every DevOps Engineer Must Master in 2026
**Alternative 2:** How to Secure Your Kubernetes Cluster in 2026: From Pod Security to Supply Chain

### Key Takeaways (for blog Key Takeaways box)

- Use Pod Security Standards "Restricted" profile for production workloads with explicit SecurityContext settings
- Implement default-deny Network Policies before opening specific traffic flows using labels
- Create dedicated service accounts per workload with least-privilege RBAC - never use the default service account
- Integrate External Secrets Operator or Vault Secrets Operator for centralized secrets management with automatic rotation
- Deploy Falco as a DaemonSet for real-time runtime threat detection using eBPF-based system call monitoring

### FAQ Candidates (for blog FAQ section)

**Q1: What is the difference between Pod Security Standards and Pod Security Policies?**
A: Pod Security Standards (PSS) replaced the deprecated Pod Security Policies (PSP) starting in Kubernetes 1.25. PSS defines three security profiles (Privileged, Baseline, Restricted) enforced through the built-in Pod Security Admission controller using namespace labels, eliminating the need for complex custom policies.

**Q2: How do I encrypt Kubernetes Secrets at rest?**
A: Kubernetes Secrets are only Base64 encoded by default. To encrypt at rest, configure the kube-apiserver with an EncryptionConfiguration using either a local encryption key (aescbc/aesgcm) or preferably a KMS v2 provider integration with AWS KMS, Google Cloud KMS, or Azure Key Vault for production environments.

**Q3: What is the best admission controller for Kubernetes - Kyverno or OPA Gatekeeper?**
A: Kyverno is recommended for teams wanting Kubernetes-native YAML policies with a lower learning curve, while OPA Gatekeeper suits organizations needing complex compliance logic using Rego. Many production environments use Kyverno for operational policies and image verification with Sigstore integration.

**Q4: How does Falco detect runtime threats in Kubernetes?**
A: Falco uses eBPF (extended Berkeley Packet Filter) to monitor Linux kernel system calls in real-time. It compares events against customizable rules to detect suspicious behavior like shell spawns in containers, sensitive file access, or unexpected network connections, triggering alerts without signature-based scanning.

**Q5: What security tools should I use for CKS exam preparation?**
A: Focus on Trivy for image vulnerability scanning (almost guaranteed on the exam), kube-bench for CIS benchmark compliance, Network Policies for microsegmentation, RBAC with kubectl auth can-i for permission verification, and Falco for runtime security alerts and audit log analysis.

### Target Keywords

**Primary:** Kubernetes security best practices
**Secondary:** Pod Security Standards, Kubernetes RBAC, Kubernetes Network Policy, Kubernetes secrets management
**Long-tail:** how to secure Kubernetes cluster 2026, Kubernetes CKS exam preparation, Kubernetes admission controllers comparison
**LSI/Related:** container security, cloud native security, etcd encryption, Falco runtime security, Sigstore image signing, service mesh mTLS

---

## MAIN RESEARCH CONTENT

## 1. Pod Security

### 1.1 Pod Security Standards (PSS)

Pod Security Standards define three cumulative security profiles that replaced the deprecated Pod Security Policies (PSP) starting in Kubernetes v1.25:

| Profile | Description | Use Case |
|---------|-------------|----------|
| **Privileged** | Unrestricted - allows all capabilities and privilege escalations | System daemons, CNI plugins, infrastructure components |
| **Baseline** | Minimally restrictive - prevents known privilege escalations | Development environments, most applications |
| **Restricted** | Heavily restricted - current Pod hardening best practices | Production workloads, security-critical applications |

**Restricted Profile Requirements (Kubernetes 1.34+):**

```yaml
# Controls enforced by Restricted profile:
spec:
  securityContext:
    runAsNonRoot: true           # Must run as non-root
    runAsUser: 1000              # Non-zero UID
    seccompProfile:
      type: RuntimeDefault       # Or Localhost
  containers:
  - name: app
    securityContext:
      allowPrivilegeEscalation: false  # Must be false
      capabilities:
        drop: ["ALL"]            # Must drop ALL
        add: ["NET_BIND_SERVICE"] # Only allowed addition
      readOnlyRootFilesystem: true
```

**Volume Type Restrictions (Restricted):**
Only these volume types are allowed: configMap, csi, downwardAPI, emptyDir, ephemeral, persistentVolumeClaim, projected, secret.

### 1.2 Pod Security Admission Controller

Enforcement is configured through namespace labels:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    # Enforcement mode - reject violating pods
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/enforce-version: v1.34

    # Audit mode - log violations but allow
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/audit-version: v1.34

    # Warn mode - show warning to user
    pod-security.kubernetes.io/warn: restricted
    pod-security.kubernetes.io/warn-version: v1.34
```

**Best Practice:** Start with warn and audit modes in existing clusters to identify violations before enforcing.

### 1.3 Security Context Configuration

Complete security context example for production pods:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    runAsGroup: 1000
    fsGroup: 1000
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: app
    image: myapp:v1.0.0@sha256:abc123...  # Pin by digest
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop: ["ALL"]
    resources:
      limits:
        cpu: "500m"
        memory: "256Mi"
      requests:
        cpu: "100m"
        memory: "128Mi"
    volumeMounts:
    - name: tmp
      mountPath: /tmp
  volumes:
  - name: tmp
    emptyDir: {}
```

---

## 2. Network Security

### 2.1 Network Policies

Kubernetes Network Policies provide declarative network segmentation at Layer 3/4.

**Best Practice #1: Default Deny All**

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: production
spec:
  podSelector: {}  # Applies to all pods
  policyTypes:
  - Ingress
  - Egress
```

**Best Practice #2: Allow Specific Traffic**

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-backend
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
```

**Best Practice #3: Always Allow DNS**

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-dns
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Egress
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          kubernetes.io/metadata.name: kube-system
      podSelector:
        matchLabels:
          k8s-app: kube-dns
    ports:
    - protocol: UDP
      port: 53
    - protocol: TCP
      port: 53
```

### 2.2 CNI Plugin Selection

| CNI Plugin | Network Policy Support | Advanced Features |
|------------|----------------------|-------------------|
| **Calico** | Full | BGP, eBPF mode, GlobalNetworkPolicy |
| **Cilium** | Full + Extended | eBPF-native, L7 policies, Hubble observability |
| **Flannel** | None | Simple overlay only |
| **Weave** | Full | Encryption, multicast |
| **Antrea** | Full | VMware integration, Traceflow |

**Recommendation:** Cilium for production environments requiring L7 policies and observability; Calico for established enterprise deployments.

### 2.3 Service Mesh Security (mTLS)

**Linkerd (Recommended for simplicity):**
- Automatic mTLS by default for all TCP connections
- Zero configuration required
- Rust-based proxy with ~10MB memory footprint
- 163ms faster than Istio at p99 percentile (2025 benchmarks)

**Istio (Recommended for complex requirements):**
- Comprehensive security with AuthorizationPolicy CRDs
- Configurable mTLS modes (STRICT, PERMISSIVE)
- Fine-grained access control
- Higher resource overhead

```yaml
# Istio PeerAuthentication for strict mTLS
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: production
spec:
  mtls:
    mode: STRICT
```

---

## 3. RBAC and Access Control

### 3.1 Core Principles

1. **Least Privilege:** Grant minimum permissions required
2. **Separation of Duties:** Different service accounts for different workloads
3. **Namespace Scoping:** Prefer Role over ClusterRole
4. **Regular Auditing:** Review RoleBindings periodically

### 3.2 Service Account Best Practices

**Never use the default service account:**

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-app-sa
  namespace: production
automountServiceAccountToken: false  # Disable if no API access needed
---
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  serviceAccountName: my-app-sa
  automountServiceAccountToken: false  # Pod-level override
```

**Disable token automounting for pods not needing API access:**

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: no-api-access
automountServiceAccountToken: false
```

### 3.3 Role and ClusterRole Examples

**Read-only Role for specific namespace:**

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: production
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list", "watch"]
```

**Deployment manager with limited permissions:**

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: deployment-manager
  namespace: production
rules:
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "watch", "create", "update", "patch"]
- apiGroups: [""]
  resources: ["configmaps", "secrets"]
  verbs: ["get", "list"]
  # Note: No "create" for secrets - must reference existing
```

### 3.4 Dangerous Permissions to Avoid

| Permission | Risk |
|------------|------|
| `create` on `pods` | Can create privileged pods |
| `*` (wildcard) verbs | Unrestricted access |
| `escalate` verb | Can grant permissions beyond own |
| `bind` verb | Can bind roles beyond own permissions |
| `impersonate` verb | Can act as any user/group |
| `create` on `secrets` | Can create arbitrary secrets |

**Verify permissions:**

```bash
# Check what a service account can do
kubectl auth can-i --list --as=system:serviceaccount:production:my-app-sa

# Check specific permission
kubectl auth can-i create pods --as=system:serviceaccount:production:my-app-sa
```

---

## 4. Secrets Management

### 4.1 The Problem with Native Secrets

Kubernetes Secrets are **only Base64 encoded** by default - not encrypted. Anyone with etcd access or API permissions can read them.

```bash
# Decode a secret (trivial)
kubectl get secret db-credentials -o jsonpath='{.data.password}' | base64 -d
```

### 4.2 Encryption at Rest

**Enable etcd encryption with KMS v2 (recommended for production):**

```yaml
# /etc/kubernetes/encryption-config.yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
- resources:
  - secrets
  - configmaps
  providers:
  - kms:
      apiVersion: v2
      name: aws-kms
      endpoint: unix:///var/run/kmsplugin/socket.sock
      cachesize: 1000
      timeout: 3s
  - identity: {}  # Fallback for reading old unencrypted data
```

**Verify encryption:**

```bash
# Check if secrets are encrypted in etcd
ETCDCTL_API=3 etcdctl get /registry/secrets/default/my-secret | hexdump -C
# Should show k8s:enc:kms:v2: prefix
```

### 4.3 External Secrets Operator (ESO)

ESO synchronizes secrets from external providers into Kubernetes:

```yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: database-credentials
  namespace: production
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: aws-secrets-manager
    kind: SecretStore
  target:
    name: db-credentials
    creationPolicy: Owner
  data:
  - secretKey: username
    remoteRef:
      key: production/database
      property: username
  - secretKey: password
    remoteRef:
      key: production/database
      property: password
```

**SecretStore configuration for AWS:**

```yaml
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: aws-secrets-manager
  namespace: production
spec:
  provider:
    aws:
      service: SecretsManager
      region: us-west-2
      auth:
        jwt:
          serviceAccountRef:
            name: external-secrets-sa
```

### 4.4 HashiCorp Vault Integration

**Vault Secrets Operator (VSO) example:**

```yaml
apiVersion: secrets.hashicorp.com/v1beta1
kind: VaultStaticSecret
metadata:
  name: app-secret
  namespace: production
spec:
  vaultAuthRef: default
  mount: secret
  type: kv-v2
  path: production/app
  destination:
    name: app-credentials
    create: true
  refreshAfter: 30s
```

**Best Practice:** Use dynamic secrets with short TTLs where possible - Vault can generate database credentials on-demand that automatically expire.

---

## 5. Image Security

### 5.1 Admission Controllers

**Kyverno Policy - Require Image Signatures:**

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: verify-image-signatures
spec:
  validationFailureAction: Enforce
  background: false
  rules:
  - name: verify-signature
    match:
      any:
      - resources:
          kinds:
          - Pod
    verifyImages:
    - imageReferences:
      - "ghcr.io/myorg/*"
      attestors:
      - entries:
        - keyless:
            subject: "https://github.com/myorg/*"
            issuer: "https://token.actions.githubusercontent.com"
            rekor:
              url: https://rekor.sigstore.dev
```

**Kyverno Policy - Block Latest Tag:**

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: disallow-latest-tag
spec:
  validationFailureAction: Enforce
  rules:
  - name: require-image-tag
    match:
      any:
      - resources:
          kinds:
          - Pod
    validate:
      message: "Images must use a specific tag, not 'latest'"
      pattern:
        spec:
          containers:
          - image: "!*:latest"
```

**OPA Gatekeeper Constraint - Trusted Registries:**

```yaml
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sAllowedRepos
metadata:
  name: require-trusted-registries
spec:
  match:
    kinds:
    - apiGroups: [""]
      kinds: ["Pod"]
  parameters:
    repos:
    - "gcr.io/my-project/"
    - "ghcr.io/myorg/"
    - "registry.internal.company.com/"
```

### 5.2 Image Scanning with Trivy

```bash
# Scan image for vulnerabilities
trivy image nginx:1.25

# Scan with severity filter
trivy image --severity HIGH,CRITICAL nginx:1.25

# Generate SBOM
trivy image --format spdx-json -o sbom.json nginx:1.25

# Scan Kubernetes cluster
trivy k8s --report summary cluster
```

**Integrate Trivy in CI/CD:**

```yaml
# GitHub Actions example
- name: Scan image
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'myapp:${{ github.sha }}'
    format: 'sarif'
    output: 'trivy-results.sarif'
    severity: 'CRITICAL,HIGH'
    exit-code: '1'
```

---

## 6. Runtime Security

### 6.1 Falco Deployment

**Install with Helm:**

```bash
helm repo add falcosecurity https://falcosecurity.github.io/charts
helm install falco falcosecurity/falco \
  --namespace falco \
  --create-namespace \
  --set driver.kind=ebpf \
  --set falcosidekick.enabled=true \
  --set falcosidekick.config.slack.webhookurl="https://hooks.slack.com/..."
```

### 6.2 Falco Rules Examples

**Detect shell spawned in container:**

```yaml
- rule: Shell Spawned in Container
  desc: Detect shell execution in container
  condition: >
    spawned_process and
    container and
    shell_procs
  output: >
    Shell spawned in container
    (user=%user.name container=%container.name
    shell=%proc.name parent=%proc.pname)
  priority: WARNING
  tags: [container, shell, mitre_execution]
```

**Detect sensitive file access:**

```yaml
- rule: Read Sensitive File
  desc: Detect read of sensitive files
  condition: >
    open_read and
    container and
    sensitive_files
  output: >
    Sensitive file opened for reading
    (user=%user.name file=%fd.name container=%container.name)
  priority: WARNING
  tags: [filesystem, confidentiality]
```

### 6.3 Audit Logging Configuration

```yaml
# /etc/kubernetes/audit-policy.yaml
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
# Log all requests to secrets at RequestResponse level
- level: RequestResponse
  resources:
  - group: ""
    resources: ["secrets"]

# Log pod exec/attach at Metadata level
- level: Metadata
  resources:
  - group: ""
    resources: ["pods/exec", "pods/attach"]

# Log authentication failures
- level: Metadata
  omitStages:
  - RequestReceived
  users: ["system:anonymous"]

# Log changes to RBAC
- level: RequestResponse
  resources:
  - group: "rbac.authorization.k8s.io"
    resources: ["roles", "rolebindings", "clusterroles", "clusterrolebindings"]

# Don't log read-only requests to configmaps
- level: None
  resources:
  - group: ""
    resources: ["configmaps"]
  verbs: ["get", "list", "watch"]

# Catch-all for everything else
- level: Metadata
  omitStages:
  - RequestReceived
```

---

## 7. Cluster Hardening

### 7.1 CIS Kubernetes Benchmark

**Run kube-bench:**

```bash
# Run as Kubernetes Job
kubectl apply -f https://raw.githubusercontent.com/aquasecurity/kube-bench/main/job.yaml

# View results
kubectl logs job/kube-bench
```

**Key CIS recommendations:**

| Control | Recommendation |
|---------|---------------|
| 1.1.1 | Ensure API server pod spec file permissions are 644 |
| 1.2.1 | Ensure anonymous-auth is disabled |
| 1.2.6 | Ensure that the --authorization-mode argument is not set to AlwaysAllow |
| 1.2.16 | Ensure admission control plugin PodSecurity is set |
| 2.1 | Ensure etcd data directory permissions are 700 |
| 2.2 | Ensure etcd data directory ownership is etcd:etcd |
| 4.2.1 | Minimize privileged containers |
| 5.1.5 | Ensure default service accounts are not used |

### 7.2 API Server Hardening

```yaml
# kube-apiserver configuration flags
--anonymous-auth=false
--authorization-mode=Node,RBAC
--enable-admission-plugins=NodeRestriction,PodSecurity
--audit-log-path=/var/log/kubernetes/audit.log
--audit-policy-file=/etc/kubernetes/audit-policy.yaml
--audit-log-maxage=30
--audit-log-maxbackup=10
--audit-log-maxsize=100
--encryption-provider-config=/etc/kubernetes/encryption-config.yaml
--tls-min-version=VersionTLS12
--tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
```

### 7.3 etcd Security

```bash
# Verify etcd encryption
ETCDCTL_API=3 etcdctl \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key \
  get /registry/secrets/default/mysecret | hexdump -C

# Should see k8s:enc:kms:v2: prefix if encrypted
```

---

## 8. Supply Chain Security

### 8.1 Sigstore and Cosign

**Sign container image:**

```bash
# Keyless signing with OIDC
cosign sign --yes ghcr.io/myorg/myapp:v1.0.0

# Sign with key
cosign sign --key cosign.key ghcr.io/myorg/myapp:v1.0.0
```

**Verify signature:**

```bash
# Keyless verification
cosign verify \
  --certificate-identity="https://github.com/myorg/myrepo/.github/workflows/build.yml@refs/heads/main" \
  --certificate-oidc-issuer="https://token.actions.githubusercontent.com" \
  ghcr.io/myorg/myapp:v1.0.0

# Verify with key
cosign verify --key cosign.pub ghcr.io/myorg/myapp:v1.0.0
```

### 8.2 SBOM Generation and Attestation

```bash
# Generate SBOM with Syft
syft ghcr.io/myorg/myapp:v1.0.0 -o spdx-json > sbom.spdx.json

# Attach SBOM as attestation
cosign attest --predicate sbom.spdx.json --type spdxjson ghcr.io/myorg/myapp:v1.0.0

# Verify attestation
cosign verify-attestation --type spdxjson ghcr.io/myorg/myapp:v1.0.0
```

### 8.3 SLSA Framework Levels

| Level | Requirements |
|-------|-------------|
| **SLSA 1** | Documentation of build process exists |
| **SLSA 2** | Version control, hosted build service, authenticated provenance |
| **SLSA 3** | Source - verified history, retained 18 months; Build - isolated, parameterless |
| **SLSA 4** | Two-person review, hermetic builds |

**GitHub Actions SLSA Generator:**

```yaml
jobs:
  build:
    outputs:
      digest: ${{ steps.build.outputs.digest }}
    steps:
    - uses: actions/checkout@v4
    - id: build
      run: |
        docker build -t myapp:${{ github.sha }} .
        echo "digest=$(docker inspect --format='{{index .RepoDigests 0}}' myapp:${{ github.sha }})" >> $GITHUB_OUTPUT

  provenance:
    needs: build
    uses: slsa-framework/slsa-github-generator/.github/workflows/generator_container_slsa3.yml@v1.9.0
    with:
      image: myapp
      digest: ${{ needs.build.outputs.digest }}
```

---

## 9. Security Tools Comparison

### 9.1 Comprehensive Tool Matrix

| Tool | Category | Function | CKS Exam |
|------|----------|----------|----------|
| **Trivy** | Image Scanning | Vulnerability, SBOM, misconfiguration | Yes |
| **Kubescape** | Posture Management | CIS, NSA/CISA compliance, risk scoring | No |
| **kube-bench** | Compliance | CIS Kubernetes Benchmark | Yes |
| **Falco** | Runtime Security | System call monitoring, threat detection | Yes |
| **Kyverno** | Policy Engine | YAML-based admission control | Partially |
| **OPA Gatekeeper** | Policy Engine | Rego-based admission control | Partially |
| **Cilium** | CNI + Security | eBPF networking, L7 policies | No |
| **Cosign** | Supply Chain | Image signing and verification | No |

### 9.2 Recommended Tool Stack

**For CKS Exam:**
- Trivy (image scanning)
- kube-bench (CIS compliance)
- Falco (runtime detection)
- Network Policies (native)
- RBAC (native)

**For Production:**
- Trivy + Kubescape (comprehensive scanning)
- Falco + Sysdig/Datadog (runtime + observability)
- Kyverno (admission control, image verification)
- External Secrets Operator (secrets management)
- Cilium (advanced networking)
- Sigstore/Cosign (supply chain)

---

## 10. CKS Certification Alignment

### 10.1 Exam Domains (2025-2026)

| Domain | Weight | Topics |
|--------|--------|--------|
| **Cluster Setup** | 10% | Network policies, CIS benchmarks, ingress security, node metadata protection |
| **Cluster Hardening** | 15% | RBAC, service accounts, upgrade kubernetes, restrict API access |
| **System Hardening** | 15% | Host OS, kernel hardening, minimize footprint |
| **Minimize Microservice Vulnerabilities** | 20% | PSS, SecurityContext, secrets management, container runtimes |
| **Supply Chain Security** | 20% | Image footprint, static analysis, scan images, sign/verify images |
| **Monitoring, Logging, Runtime Security** | 20% | Audit logs, Falco, container immutability, workload behavior |

### 10.2 High-Priority Study Topics

**Based on community feedback and exam objectives:**

1. **NetworkPolicies** - Default deny first, always allow DNS egress
2. **RBAC** - Enforce least privilege, verify with `kubectl auth can-i`
3. **Trivy** - Image scanning is almost guaranteed
4. **Falco** - Understanding alerts and rules
5. **Audit logs** - Configuration and analysis
6. **Pod Security Standards** - Restricted profile enforcement
7. **Secrets** - Encryption at rest, secret management
8. **crictl** - Container runtime investigation

---

## CITATIONS & RESOURCES

### Official Documentation (for video description)

| Resource | URL | Use For |
|----------|-----|---------|
| Kubernetes Security | https://kubernetes.io/docs/concepts/security/ | Primary reference |
| Pod Security Standards | https://kubernetes.io/docs/concepts/security/pod-security-standards/ | PSS configuration |
| Network Policies | https://kubernetes.io/docs/concepts/services-networking/network-policies/ | Network segmentation |
| RBAC Good Practices | https://kubernetes.io/docs/concepts/security/rbac-good-practices/ | Access control |
| CKS Certification | https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/ | Exam preparation |
| CIS Kubernetes Benchmark | https://www.cisecurity.org/benchmark/kubernetes | Compliance |
| Falco Documentation | https://falco.org/docs/ | Runtime security |
| Sigstore Documentation | https://docs.sigstore.dev/ | Supply chain security |

### All Citations

1. [Kubernetes Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/) - Official PSS documentation
2. [Kubernetes Security Concepts](https://kubernetes.io/docs/concepts/security/) - Kubernetes security overview
3. [Pod Security Admission](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) - Security context configuration
4. [Kubernetes RBAC Good Practices](https://kubernetes.io/docs/concepts/security/rbac-good-practices/) - Official RBAC guidance
5. [RBAC Authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) - RBAC reference
6. [Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) - Official network policy docs
7. [Kubernetes Audit Logging](https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/) - Audit configuration
8. [External Secrets Operator](https://external-secrets.io/latest/) - ESO documentation
9. [Vault Secrets Operator](https://developer.hashicorp.com/vault/docs/deploy/kubernetes/vso) - HashiCorp VSO docs
10. [Encrypting Data at Rest](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/) - etcd encryption
11. [KMS Provider](https://kubernetes.io/docs/tasks/administer-cluster/kms-provider/) - KMS v2 configuration
12. [Falco Project](https://falco.org/) - Runtime security tool
13. [CNCF Falco 2025 Announcement](https://www.cncf.io/announcements/2025/11/10/falco-links-real-time-detection-with-forensic-level-analysis-in-the-cloud-native-stack/) - Stratoshark integration
14. [Sigstore Cosign](https://github.com/sigstore/cosign) - Container signing
15. [Kyverno Policies](https://kyverno.io/policies/pod-security/) - Policy examples
16. [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper) - Policy engine
17. [CIS Kubernetes Benchmark](https://www.cisecurity.org/benchmark/kubernetes) - Compliance framework
18. [kube-bench](https://github.com/aquasecurity/kube-bench) - CIS benchmark tool
19. [Trivy](https://github.com/aquasecurity/trivy) - Vulnerability scanner
20. [Kubescape](https://github.com/kubescape/kubescape) - Security posture
21. [CKS Certification](https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/) - Linux Foundation
22. [CNCF CKS](https://www.cncf.io/training/certification/cks/) - CNCF certification page
23. [Kubernetes v1.35 Release](https://kubernetes.io/blog/2025/12/17/kubernetes-v1-35-release/) - Latest K8s version
24. [CNCF Kubernetes Security 2025](https://www.cncf.io/blog/2025/12/15/kubernetes-security-2025-stable-features-and-2026-preview/) - Security features overview
25. [Tigera Network Policy Guide](https://www.tigera.io/learn/guides/kubernetes-security/kubernetes-network-policy/) - Network policy best practices
26. [Wiz RBAC Best Practices](https://www.wiz.io/academy/container-security/kubernetes-rbac-best-practices) - Advanced RBAC
27. [Infisical Secrets Management 2025](https://infisical.com/blog/kubernetes-secrets-management-2025) - Modern secrets approach
28. [Supply Chain Security 2025](https://faithforgelabs.com/blog_supplychain_security_2025.php) - SBOM and SLSA
29. [Linkerd vs Istio](https://www.buoyant.io/linkerd-vs-istio) - Service mesh comparison
30. [EKS Pod Security Standards](https://www.eksworkshop.com/docs/security/pod-security-standards/) - AWS guidance

---

## Appendix A: Security Checklist

### Pre-Deployment Checklist

- [ ] Pod Security Standards "Restricted" profile configured for production namespaces
- [ ] Default-deny NetworkPolicy applied to all namespaces
- [ ] RBAC with dedicated service accounts per workload
- [ ] Secrets encrypted at rest with KMS v2
- [ ] External Secrets Operator or Vault integration configured
- [ ] Image signing with Sigstore/Cosign in CI/CD
- [ ] Admission controller (Kyverno/Gatekeeper) enforcing policies
- [ ] Trivy scanning integrated in CI/CD pipeline
- [ ] Falco DaemonSet deployed for runtime monitoring
- [ ] Audit logging enabled with appropriate retention
- [ ] CIS Benchmark compliance verified with kube-bench
- [ ] TLS 1.2+ enforced for all API server communication
- [ ] etcd access restricted to authenticated clients only
- [ ] Node metadata service blocked from pods

### Runtime Monitoring Checklist

- [ ] Falco alerts configured for shell spawns, file access, network anomalies
- [ ] Audit logs forwarded to SIEM with alerting rules
- [ ] Resource quotas and limit ranges enforced
- [ ] Pod disruption budgets configured for critical workloads
- [ ] Horizontal pod autoscaling with security constraints
- [ ] Regular vulnerability scans of running workloads
- [ ] Incident response runbook documented and tested

---

## Appendix B: YAML Templates

### Complete Secure Deployment Template

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: secure-app
  namespace: production
  labels:
    app: secure-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: secure-app
  template:
    metadata:
      labels:
        app: secure-app
    spec:
      serviceAccountName: secure-app-sa
      automountServiceAccountToken: false
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 1000
        fsGroup: 1000
        seccompProfile:
          type: RuntimeDefault
      containers:
      - name: app
        image: ghcr.io/myorg/secure-app:v1.0.0@sha256:abc123...
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop: ["ALL"]
        ports:
        - containerPort: 8080
          protocol: TCP
        resources:
          limits:
            cpu: "500m"
            memory: "256Mi"
          requests:
            cpu: "100m"
            memory: "128Mi"
        livenessProbe:
          httpGet:
            path: /healthz
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
        volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: config
          mountPath: /etc/app
          readOnly: true
      volumes:
      - name: tmp
        emptyDir: {}
      - name: config
        configMap:
          name: secure-app-config
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: secure-app-sa
  namespace: production
automountServiceAccountToken: false
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: secure-app-network
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: secure-app
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          kubernetes.io/metadata.name: kube-system
      podSelector:
        matchLabels:
          k8s-app: kube-dns
    ports:
    - protocol: UDP
      port: 53
```

---

*Research completed 2026-01-11 by Gheware DevOps AI Research Agent*
