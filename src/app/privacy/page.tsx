'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Eye, Database, Lock, Mail, Clock, FileText } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export default function PrivacyPolicyPage() {
  const { t } = useLanguage()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Navigation */}
      <div className="flex items-center justify-between border-b pb-4">
        <a 
          href="/login" 
          className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
        >
          <Shield className="h-5 w-5" />
          <span className="font-semibold">ads169th System</span>
        </a>
        <div className="flex items-center space-x-4 text-sm">
          <a 
            href="/terms" 
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {t('terms.title')}
          </a>
          <a 
            href="/privacy" 
            className="text-primary font-medium"
          >
            {t('privacy.title')}
          </a>
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Shield className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t('privacy.title')}
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('privacy.subtitle')}
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{t('privacy.lastUpdated')}: {new Date().toLocaleDateString('th-TH')}</span>
        </div>
      </div>

      {/* Information Collection */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Database className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>{t('privacy.collection.title')}</CardTitle>
              <CardDescription>{t('privacy.collection.description')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">{t('privacy.collection.personal.title')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('privacy.collection.personal.name')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('privacy.collection.personal.email')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('privacy.collection.personal.username')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('privacy.collection.personal.role')}</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">{t('privacy.collection.technical.title')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('privacy.collection.technical.ip')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('privacy.collection.technical.browser')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('privacy.collection.technical.device')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('privacy.collection.technical.activity')}</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How We Use Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Eye className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>{t('privacy.usage.title')}</CardTitle>
              <CardDescription>{t('privacy.usage.description')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">{t('privacy.usage.service.title')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('privacy.usage.service.authentication')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('privacy.usage.service.authorization')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('privacy.usage.service.personalization')}</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">{t('privacy.usage.security.title')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('privacy.usage.security.monitoring')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('privacy.usage.security.fraud')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('privacy.usage.security.compliance')}</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">{t('privacy.usage.improvement.title')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('privacy.usage.improvement.analytics')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('privacy.usage.improvement.performance')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('privacy.usage.improvement.features')}</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Protection */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Lock className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>{t('privacy.protection.title')}</CardTitle>
              <CardDescription>{t('privacy.protection.description')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-primary">{t('privacy.protection.technical.title')}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start space-x-3">
                  <Lock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{t('privacy.protection.technical.encryption.title')}</p>
                    <p>{t('privacy.protection.technical.encryption.description')}</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{t('privacy.protection.technical.access.title')}</p>
                    <p>{t('privacy.protection.technical.access.description')}</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <FileText className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{t('privacy.protection.technical.audit.title')}</p>
                    <p>{t('privacy.protection.technical.audit.description')}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-primary">{t('privacy.protection.organizational.title')}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start space-x-3">
                  <Eye className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{t('privacy.protection.organizational.access.title')}</p>
                    <p>{t('privacy.protection.organizational.access.description')}</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{t('privacy.protection.organizational.retention.title')}</p>
                    <p>{t('privacy.protection.organizational.retention.description')}</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Database className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{t('privacy.protection.organizational.backup.title')}</p>
                    <p>{t('privacy.protection.organizational.backup.description')}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Your Rights */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>{t('privacy.rights.title')}</CardTitle>
              <CardDescription>{t('privacy.rights.description')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <Eye className="h-6 w-6 text-primary" />
              <h4 className="font-semibold">{t('privacy.rights.access.title')}</h4>
              <p className="text-sm text-muted-foreground">{t('privacy.rights.access.description')}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <FileText className="h-6 w-6 text-primary" />
              <h4 className="font-semibold">{t('privacy.rights.correction.title')}</h4>
              <p className="text-sm text-muted-foreground">{t('privacy.rights.correction.description')}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <Database className="h-6 w-6 text-primary" />
              <h4 className="font-semibold">{t('privacy.rights.deletion.title')}</h4>
              <p className="text-sm text-muted-foreground">{t('privacy.rights.deletion.description')}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <Mail className="h-6 w-6 text-primary" />
              <h4 className="font-semibold">{t('privacy.rights.contact.title')}</h4>
              <p className="text-sm text-muted-foreground">{t('privacy.rights.contact.description')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Mail className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>{t('privacy.contact.title')}</CardTitle>
              <CardDescription>{t('privacy.contact.description')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">{t('privacy.contact.methods.title')}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{t('privacy.contact.methods.email')}:</span>
                  <a href="mailto:privacy@ads169th.com" className="text-primary hover:underline">
                    privacy@ads169th.com
                  </a>
                </div>
                <div className="flex items-start space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground">{t('privacy.contact.methods.response')}:</span>
                  <span>{t('privacy.contact.methods.responseTime')}</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">{t('privacy.contact.policy.title')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('privacy.contact.policy.description')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('privacy.contact.policy.updates')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground border-t pt-6">
        <p>{t('privacy.footer.version')}: 1.0 | {t('privacy.footer.effective')}: {new Date().toLocaleDateString('th-TH')}</p>
        <p className="mt-2">{t('privacy.footer.notice')}</p>
      </div>
    </div>
  )
}